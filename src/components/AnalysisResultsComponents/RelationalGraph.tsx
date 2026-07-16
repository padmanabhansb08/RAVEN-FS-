import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult, GraphNode } from '../../types';
import { NetworkGraph } from '../NetworkGraph';
import { Dispatch, SetStateAction } from 'react';

interface RelationalGraphProps {
  readonly analysisResult: AnalysisResult;
  readonly selectedNode: GraphNode | null;
  readonly setSelectedNode: Dispatch<SetStateAction<GraphNode | null>>;
}

export function RelationalGraph({
  analysisResult,
  selectedNode,
  setSelectedNode,
}: RelationalGraphProps) {
  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-5 md:p-6 space-y-4">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-violet-300" />
            Relationship graph
          </h4>
          <p className="text-[9.5px] text-slate-500 mt-0.5">
            Select nodes to inspect links and extracted details.
          </p>
        </div>
        <div className="flex gap-1.5 text-[9.5px] font-mono shrink-0">
          <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-full text-slate-400 font-semibold">
            Nodes: <strong className="text-violet-300">{analysisResult.graphNodes.length}</strong>
          </span>
          <span className="bg-black/30 border border-white/10 px-2 py-0.5 rounded-full text-slate-400 font-semibold">
            Edges: <strong className="text-violet-300">{analysisResult.graphEdges.length}</strong>
          </span>
        </div>
      </div>

      <div className="bg-black/30 rounded-2xl border border-white/10 overflow-hidden">
        <NetworkGraph
          nodes={analysisResult.graphNodes}
          edges={analysisResult.graphEdges}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="rounded-2xl border border-violet-500/20 bg-violet-500/8 p-4 space-y-2"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-violet-200 tracking-wider">
                Selected node
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-white font-mono text-[10px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
            <h5 className="text-sm font-semibold text-white">{selectedNode.label}</h5>
            <p className="text-sm text-slate-300 leading-6">
              {selectedNode.details || 'Extracted relation node.'}
            </p>
            <div className="text-[10px] font-mono text-slate-500 flex gap-4 uppercase font-semibold">
              <span>
                Type: <strong className="text-slate-300">{selectedNode.type}</strong>
              </span>
              <span>
                Status: <strong className="text-violet-200">{selectedNode.status || 'Audited'}</strong>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
