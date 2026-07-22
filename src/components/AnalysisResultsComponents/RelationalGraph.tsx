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
    <div className="glass-panel rounded-none border border-white/10 p-5 md:p-6 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div className="border-b border-white/10 pb-3 flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            Relationship Graph
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">
            Select nodes to inspect links and extracted details.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono shrink-0">
          <span className="bg-black/40 border border-white/10 px-3 py-1 rounded-full text-slate-400 font-bold uppercase tracking-wider">
            Nodes: <strong className="text-teal-400">{analysisResult.graphNodes.length}</strong>
          </span>
          <span className="bg-black/40 border border-white/10 px-3 py-1 rounded-full text-slate-400 font-bold uppercase tracking-wider">
            Edges: <strong className="text-teal-400">{analysisResult.graphEdges.length}</strong>
          </span>
        </div>
      </div>

      <div className="bg-black/40 rounded-none border border-white/10 overflow-hidden shadow-inner relative">
        <NetworkGraph
          nodes={analysisResult.graphNodes}
          edges={analysisResult.graphEdges}
          onSelectNode={(node) => setSelectedNode(node)}
        />
        <div className="absolute inset-0 pointer-events-none rounded-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="rounded-none border border-teal-500/20 bg-teal-500/10 p-5 space-y-3 shadow-[0_5px_15px_rgba(20,184,166,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
              <span className="text-[10px] uppercase font-mono font-bold text-teal-300 tracking-[0.2em]">
                Selected Node
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors"
              >
                Dismiss
              </button>
            </div>
            <h5 className="text-base font-bold text-white relative z-10">{selectedNode.label}</h5>
            <p className="text-sm text-slate-300 leading-relaxed font-light relative z-10">
              {selectedNode.details || 'Extracted relation node.'}
            </p>
            <div className="text-[10px] font-mono text-slate-500 flex gap-5 uppercase font-bold tracking-widest relative z-10 mt-2">
              <span className="flex items-center gap-1.5">
                Type: <strong className="text-teal-100">{selectedNode.type}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                Status:{' '}
                <strong className="text-teal-300">{selectedNode.status || 'Audited'}</strong>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
