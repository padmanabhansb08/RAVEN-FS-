import {
  AnalysisResult,
  Contradiction,
  DocumentItem,
  ExtractedEntity,
  GraphEdge,
  GraphNode,
  GraphNodeType,
} from '../types.js';

interface RecordFields {
  document: DocumentItem;
  values: Map<string, string[]>;
}

const FUNDS_ROUTED_TO = 'Funds Routed To';
const USED_SHARED_DEVICE = 'Used Shared Device';

const parseFields = (document: DocumentItem): RecordFields => {
  const values = new Map<string, string[]>();

  for (const rawLine of document.content.split('\n')) {
    const separator = rawLine.indexOf(':');
    if (separator < 1) continue;

    const key = rawLine.slice(0, separator).trim().toUpperCase();
    const value = rawLine.slice(separator + 1).trim();
    if (!value) continue;

    values.set(key, [...(values.get(key) ?? []), value]);
  }

  return { document, values };
};

const getValues = (record: RecordFields, ...keys: string[]): string[] =>
  keys.flatMap((key) => record.values.get(key) ?? []);

const getFirst = (record: RecordFields, ...keys: string[]): string | undefined =>
  getValues(record, ...keys)[0];

const stableId = (type: GraphNodeType, value: string): string =>
  `${type}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

const toDisplayCase = (value: string): string =>
  value
    .toLocaleLowerCase()
    .split(' ')
    .map((word) => `${word.charAt(0).toLocaleUpperCase()}${word.slice(1)}`)
    .join(' ');

const getVerdict = (score: number): AnalysisResult['verdict'] => {
  if (score > 60) return 'HIGH RISK';
  if (score > 30) return 'MEDIUM RISK';
  return 'LOW RISK';
};

class FraudGraphBuilder {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly edges = new Map<string, GraphEdge>();

  addNode(type: GraphNodeType, value: string, details: string): string {
    const id = stableId(type, value);
    if (!this.nodes.has(id)) {
      this.nodes.set(id, {
        id,
        label: value,
        type,
        status: type === 'person' ? 'neutral' : 'flagged',
        details,
      });
    }
    return id;
  }

  addEdge(source: string | undefined, target: string | undefined, relationship: string): void {
    if (!source || !target || source === target) return;

    const key = `${source}|${target}|${relationship}`;
    this.edges.set(key, { source, target, relationship, status: 'flagged' });
  }

  result(): { graphNodes: GraphNode[]; graphEdges: GraphEdge[] } {
    return {
      graphNodes: [...this.nodes.values()],
      graphEdges: [...this.edges.values()],
    };
  }
}

const addEntity = (
  entities: ExtractedEntity[],
  seen: Set<string>,
  value: string,
  classification: string,
  document: DocumentItem,
): void => {
  const key = `${document.id}|${classification}|${value}`;
  if (seen.has(key)) return;

  seen.add(key);
  entities.push({ entity: value, value: classification, docType: document.type });
};

const addRecordGraph = (
  record: RecordFields,
  graph: FraudGraphBuilder,
  entities: ExtractedEntity[],
  seenEntities: Set<string>,
): void => {
  const { document } = record;
  const people = getValues(record, 'NAME', 'ACCOUNT HOLDER', 'LINKED ACCOUNT HOLDER');
  const phones = getValues(record, 'CALLER', 'CALLEE', 'CONTACTED BY', 'REGISTERED PHONE');
  const accounts = getValues(
    record,
    'ACCOUNT',
    'LINKED ACCOUNT',
    'FROM ACCOUNT',
    'TO ACCOUNT',
    'NEXT HOP ACCOUNT',
    'ACCOUNT SESSION',
    'SECOND ACCOUNT SESSION',
    'UPI ID',
    'UPI BENEFICIARY',
    'TO UPI',
  );
  const devices = getValues(record, 'DEVICE IMEI', 'REGISTERED DEVICE', 'DEVICE ID');
  const transactionId = getFirst(record, 'TRANSACTION ID');

  people.forEach((value) => addEntity(entities, seenEntities, value, 'Person', document));
  phones.forEach((value) => addEntity(entities, seenEntities, value, 'Phone Number', document));
  accounts.forEach((value) => addEntity(entities, seenEntities, value, 'Account', document));
  devices.forEach((value) => addEntity(entities, seenEntities, value, 'Device', document));
  if (transactionId) addEntity(entities, seenEntities, transactionId, 'Transaction', document);

  const personNodes = people.map((value) => graph.addNode('person', value, document.name));
  const phoneNodes = phones.map((value) => graph.addNode('phone', value, document.name));
  const accountNodes = accounts.map((value) => graph.addNode('account', value, document.name));
  const deviceNodes = devices.map((value) => graph.addNode('device', value, document.name));
  const transactionNode = transactionId
    ? graph.addNode('transaction', transactionId, document.name)
    : undefined;

  if (document.type === 'VICTIM_REPORT') {
    graph.addEdge(personNodes[0], phoneNodes[0], 'Contacted By');
    graph.addEdge(personNodes[0], accountNodes[0], 'Transferred To');
  }

  if (document.type === 'CALL_RECORD') {
    graph.addEdge(phoneNodes[0], phoneNodes[1], 'Called');
    graph.addEdge(deviceNodes[0], phoneNodes[0], 'Originated Call');
  }

  if (document.type === 'TRANSACTION_LOG') {
    graph.addEdge(accountNodes[0], transactionNode, 'Initiated Transaction');
    graph.addEdge(transactionNode, accountNodes[1], FUNDS_ROUTED_TO);
    graph.addEdge(transactionNode, accountNodes[2], FUNDS_ROUTED_TO);
    graph.addEdge(accountNodes[1], accountNodes[2], FUNDS_ROUTED_TO);
  }

  if (document.type === 'ACCOUNT_LINKAGE') {
    graph.addEdge(accountNodes[0], phoneNodes[0], 'Registered Phone');
    graph.addEdge(accountNodes[0], deviceNodes[0], USED_SHARED_DEVICE);
    graph.addEdge(accountNodes[1], deviceNodes[0], USED_SHARED_DEVICE);
    graph.addEdge(accountNodes[0], accountNodes[1], 'Linked Account');
  }

  if (document.type === 'DEVICE_LOG') {
    graph.addEdge(accountNodes[0], deviceNodes[0], USED_SHARED_DEVICE);
    graph.addEdge(accountNodes[1], deviceNodes[0], USED_SHARED_DEVICE);
  }
};

const buildContradictions = (records: RecordFields[]): Contradiction[] => {
  const contradictions: Contradiction[] = [];

  if (records.some((record) => getValues(record, 'SECOND ACCOUNT SESSION').length > 0)) {
    contradictions.push({
      title: 'Shared Device Across Mule Accounts',
      severity: 'high',
      description:
        'Multiple nominally unrelated accounts authenticate through the same device identifier.',
      crossDocSource: 'Account Linkage vs Device Log',
    });
  }

  if (records.some((record) => getValues(record, 'NEXT HOP ACCOUNT', 'NEXT HOP TIME').length > 1)) {
    contradictions.push({
      title: 'Rapid Layered Fund Routing',
      severity: 'high',
      description:
        'Victim funds move to a second-hop account within minutes, consistent with mule layering.',
      crossDocSource: 'Victim Report vs Transaction Log',
    });
  }

  if (records.some((record) => getValues(record, 'SPOOFING SIGNATURE').length > 0)) {
    contradictions.push({
      title: 'Spoofed Caller Infrastructure Link',
      severity: 'high',
      description:
        'A spoofing signature, caller number, and device identifier converge across call and account records.',
      crossDocSource: 'Call Record vs Account Linkage',
    });
  }

  return contradictions;
};

export const analyzeFraudNetworkDocuments = (documents: DocumentItem[]): AnalysisResult => {
  const records = documents.map(parseFields);
  const graph = new FraudGraphBuilder();
  const extractedEntities: ExtractedEntity[] = [];
  const seenEntities = new Set<string>();

  records.forEach((record) => addRecordGraph(record, graph, extractedEntities, seenEntities));

  const contradictions = buildContradictions(records);
  const highSeverityCount = contradictions.filter(({ severity }) => severity === 'high').length;
  const score = Math.min(10 + highSeverityCount * 30, 99);
  const verdict = getVerdict(score);
  const jurisdictions = records.flatMap((record) =>
    getValues(record, 'DISTRICT', 'JURISDICTION', 'CELL LOCATION', 'IP LOCATION'),
  );
  const crossJurisdictionNote =
    jurisdictions.length > 1
      ? `Signals link ${[...new Set(jurisdictions.map(toDisplayCase))].join(' and ')}. Coordinate inter-state review.`
      : 'No cross-jurisdiction linkage established from the submitted records.';
  const { graphNodes, graphEdges } = graph.result();

  return {
    score,
    verdict,
    summary:
      contradictions.length > 0
        ? `RAVEN linked ${documents.length} records into a coordinated fraud network with ${contradictions.length} high-confidence indicators. Treat these links as investigative leads pending analyst verification.`
        : 'No coordinated fraud-network pattern was established from the submitted records.',
    contradictions,
    extractedEntities,
    graphNodes,
    graphEdges,
    tamperedSignatures: [],
    caseFileDetails: {
      bankActionRequired:
        score > 60
          ? 'Preserve transaction records and consider temporary beneficiary-account controls under authorised procedures.'
          : 'Continue standard monitoring and analyst review.',
      rbiComplianceWarning:
        'This prototype produces advisory intelligence leads and does not independently establish guilt.',
      recommendingRejection: score > 60,
      lawEnforcementAction:
        score > 60
          ? 'Correlate the linked phone, device, and beneficiary accounts with NCRP/I4C records.'
          : 'Retain the record for correlation with future complaints.',
      ncrbFilingRecommended: score > 60,
      courtPackageReady: false,
      crossJurisdictionNote,
    },
  };
};
