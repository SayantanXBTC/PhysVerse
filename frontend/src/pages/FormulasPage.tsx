import { useState } from 'react';
import { BookOpen, Search, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formulas, type Formula } from '@/data/formulas';

export default function FormulasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(formulas.map(f => f.category)))];

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formula.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyFormula = (formula: Formula) => {
    navigator.clipboard.writeText(formula.formula);
    setCopiedId(formula.id);
    toast.success('Formula copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const difficultyColors = {
    basic: 'text-green-400 bg-green-500/20 border-green-500/30',
    intermediate: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    advanced: 'text-purple-400 bg-purple-500/20 border-purple-500/30'
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <BookOpen className="text-blue-400" size={20} />
            <span className="text-blue-300 text-sm font-medium">Physics Reference</span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Formula Library
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            63 essential physics formulas at your fingertips
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="glass-red p-4 rounded-xl text-center">
            <div className="text-3xl font-black text-cyan-400 mb-1">{formulas.length}</div>
            <div className="text-sm text-gray-400">Total Formulas</div>
          </div>
          <div className="glass-red p-4 rounded-xl text-center">
            <div className="text-3xl font-black text-blue-400 mb-1">{categories.length - 1}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="glass-red p-4 rounded-xl text-center">
            <div className="text-3xl font-black text-purple-400 mb-1">{filteredFormulas.length}</div>
            <div className="text-sm text-gray-400">Showing</div>
          </div>
        </div>
        {/* Formulas Grid */}
        <div className="space-y-6">
          {filteredFormulas.map((formula) => (
            <div
              key={formula.id}
              className="glass-red p-6 rounded-2xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-black text-white">{formula.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[formula.difficulty]}`}>
                      {formula.difficulty.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-700/50 text-gray-300">
                      {formula.category}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4">{formula.description}</p>

                  {/* Formula Display */}
                  <div className="mb-4 p-4 bg-black/50 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                    <code className="text-2xl font-mono text-cyan-300">{formula.formula}</code>
                    <button
                      type="button"
                      onClick={() => copyFormula(formula)}
                      className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all"
                      aria-label="Copy formula"
                    >
                      {copiedId === formula.id ? (
                        <Check className="text-green-400" size={20} />
                      ) : (
                        <Copy className="text-gray-400 hover:text-cyan-400" size={20} />
                      )}
                    </button>
                  </div>

                  {/* Variables */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Variables:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formula.variables.map((variable, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <code className="text-cyan-400 font-mono font-bold">{variable.symbol}</code>
                          <span className="text-gray-400">
                            = {variable.meaning} <span className="text-gray-500">({variable.unit})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formula.applications.map((app, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFormulas.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="mx-auto mb-4 text-gray-600" size={64} />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No formulas found</h3>
            <p className="text-gray-500">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
