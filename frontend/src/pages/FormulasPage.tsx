import { useState } from 'react';
import { BookOpen, Search, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formulas, type Formula } from '@/data/formulas';

export default function FormulasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(formulas.map(f => f.category)))];

  const filteredFormulas = formulas.filter((formula) => {
    const matchesSearch =
      formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyFormula = (formula: Formula) => {
    navigator.clipboard.writeText(formula.formula);
    setCopiedId(formula.id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const difficultyStyle: Record<Formula['difficulty'], string> = {
    basic: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
    advanced: 'text-red-300 bg-red-500/10 border-red-500/25'
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-rose-950/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400/80 mb-2">
            Reference
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight [text-wrap:balance]">
            Formula Library
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl">
            Physics reference. Variables, applications, and worked context for every entry.
          </p>
        </header>

        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search formulas, variables, equations…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e10] border border-white/[0.08] focus:border-red-500/50 rounded-lg text-sm text-white placeholder-gray-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                      : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mb-5 font-mono text-[11px] tracking-widest uppercase text-gray-500 tabular-nums">
          {filteredFormulas.length} / {formulas.length} entries
        </p>

        <div className="space-y-4">
          {filteredFormulas.map((formula) => (
            <article
              key={formula.id}
              className="group rounded-2xl border border-white/[0.06] hover:border-red-500/30 bg-[#0e0e10] p-6 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-white mr-1">{formula.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest border ${difficultyStyle[formula.difficulty]}`}
                >
                  {formula.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-white/[0.03] border border-white/10 text-gray-400">
                  {formula.category}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4 [text-wrap:pretty]">
                {formula.description}
              </p>

              <div className="mb-4 flex items-center justify-between gap-3 p-4 bg-black/60 rounded-lg border border-red-500/20">
                <code className="text-lg sm:text-xl font-mono text-red-200 tracking-wide overflow-x-auto">
                  {formula.formula}
                </code>
                <button
                  type="button"
                  onClick={() => copyFormula(formula)}
                  className="shrink-0 p-2 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 rounded-md transition-colors"
                  aria-label="Copy formula"
                >
                  {copiedId === formula.id ? (
                    <Check className="text-emerald-400" size={16} />
                  ) : (
                    <Copy className="text-gray-400 hover:text-red-300" size={16} />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Variables</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {formula.variables.map((variable, idx) => (
                    <div key={idx} className="flex items-baseline gap-2 text-xs">
                      <code className="text-red-300 font-mono font-bold min-w-[24px]">
                        {variable.symbol}
                      </code>
                      <span className="text-gray-300">
                        {variable.meaning}
                        <span className="text-gray-500 ml-1">({variable.unit})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Applications</p>
                <div className="flex flex-wrap gap-1.5">
                  {formula.applications.map((app, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-red-500/[0.06] text-red-300 text-[11px] rounded border border-red-500/15"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredFormulas.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="mx-auto mb-4 text-gray-700" size={40} />
            <p className="text-white font-semibold mb-1">No formulas match</p>
            <p className="text-sm text-gray-500">Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
