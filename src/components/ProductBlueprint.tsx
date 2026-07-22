import { Layers3, ShieldCheck, Sparkles, Workflow, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

const pillars = [
  {
    icon: Workflow,
    title: 'Execution Engine',
    text: 'A document analysis workspace that ingests files, compares evidence, and produces a structured risk report.',
  },
  {
    icon: ShieldCheck,
    title: 'Security Compliance',
    text: 'Support the current analysis endpoints, keep upload and editor flows stable, and remain highly secure.',
  },
  {
    icon: Sparkles,
    title: 'Holographic Experience',
    text: 'Premium, calm, and intentional with a deep navy base, cyber-teal accents, and precise structural patterns.',
  },
];

export function ProductBlueprint() {
  const scrollToWorkspace = () => {
    const workspaceElement = document.getElementById('execution-workspace');
    if (workspaceElement) {
      workspaceElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 relative min-h-[85vh]">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-300 mb-8">
          <Layers3 className="h-4 w-4" />
          Aurora Interface System
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 leading-[1.1] mb-6">
          High-precision analytical shell for document intelligence.
        </h1>
        
        <p className="text-lg md:text-xl leading-relaxed text-slate-400 max-w-2xl font-light mb-12">
          Transforming technical capability into an immersive, premium workspace. 
          Experience a defined purpose, ultra-clean hierarchy, and dynamic usability.
        </p>

        <button 
          onClick={scrollToWorkspace}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold uppercase tracking-widest text-sm transition-all duration-300 rounded-full overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <span className="relative z-10">Start Analysis Workflow</span>
          <ArrowDown className="relative z-10 w-4 h-4 animate-bounce" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto relative z-10 w-full text-left"
      >
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="flex flex-col gap-4 p-2 border-l border-white/10 hover:border-teal-500/40 transition-colors duration-500 pl-6">
              <div className="w-12 h-12 bg-black/40 border border-white/10 flex items-center justify-center text-teal-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">{pillar.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">{pillar.text}</p>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
