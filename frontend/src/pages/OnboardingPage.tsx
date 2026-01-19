import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Target, Palette, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const topics = [
  { id: 'mechanics', name: 'Classical Mechanics', icon: '⚙️', description: 'Newton\'s laws, motion, forces' },
  { id: 'quantum', name: 'Quantum Physics', icon: '⚛️', description: 'Particles, waves, uncertainty' },
  { id: 'relativity', name: 'Relativity', icon: '🌌', description: 'Space-time, gravity, speed of light' },
  { id: 'thermodynamics', name: 'Thermodynamics', icon: '🔥', description: 'Heat, energy, entropy' },
  { id: 'electromagnetism', name: 'Electromagnetism', icon: '⚡', description: 'Electric and magnetic fields' },
  { id: 'astrophysics', name: 'Astrophysics', icon: '🌟', description: 'Stars, galaxies, cosmology' },
  { id: 'optics', name: 'Optics', icon: '🔬', description: 'Light, lenses, waves' },
  { id: 'nuclear', name: 'Nuclear Physics', icon: '☢️', description: 'Atoms, radiation, reactions' },
];

const themes = [
  { id: 'red', name: 'Crimson Fire', primary: '#ef4444', secondary: '#f43f5e', preview: 'from-red-600 to-rose-600' },
  { id: 'blue', name: 'Ocean Deep', primary: '#3b82f6', secondary: '#06b6d4', preview: 'from-blue-600 to-cyan-600' },
  { id: 'purple', name: 'Cosmic Purple', primary: '#8b5cf6', secondary: '#a855f7', preview: 'from-purple-600 to-violet-600' },
  { id: 'green', name: 'Forest Green', primary: '#10b981', secondary: '#14b8a6', preview: 'from-green-600 to-teal-600' },
  { id: 'orange', name: 'Sunset Orange', primary: '#f97316', secondary: '#fb923c', preview: 'from-orange-600 to-amber-600' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('red');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const totalSteps = 3;

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleComplete = () => {
    // TODO: Save preferences to backend
    toast.success('Welcome to PhysVerse! 🎉');
    navigate('/dashboard', { replace: true }); // Replace history so back button works correctly
  };

  const handleSkip = () => {
    navigate('/dashboard', { replace: true }); // Replace history so back button works correctly
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeInUp">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-full mb-4 shadow-2xl shadow-red-500/50">
                <Sparkles className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                Welcome, {user?.name}!
              </h2>
              <p className="text-xl text-gray-300">
                Let's personalize your PhysVerse experience
              </p>
            </div>

            <div className="glass-red p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="text-red-400" />
                What interests you most?
              </h3>
              <p className="text-gray-400 mb-6">
                Select the physics topics you'd like to explore (choose at least 2)
              </p>

              <div className="grid grid-cols-2 gap-4">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedTopics.includes(topic.id)
                        ? 'bg-red-500/20 border-red-500/60 scale-105'
                        : 'bg-gray-900/50 border-gray-700/50 hover:border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{topic.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-white">{topic.name}</h4>
                          {selectedTopics.includes(topic.id) && (
                            <Check className="text-green-400" size={20} />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{topic.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeInUp">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl shadow-purple-500/50">
                <Palette className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Choose Your Theme
              </h2>
              <p className="text-xl text-gray-300">
                Customize the look and feel of PhysVerse
              </p>
            </div>

            <div className="glass-red p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Select a color theme</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedTheme === theme.id
                        ? 'border-white/60 scale-105'
                        : 'border-gray-700/50 hover:border-gray-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.preview} shadow-lg`}></div>
                      <div className="text-left flex-1">
                        <h4 className="font-bold text-white text-lg">{theme.name}</h4>
                        <div className="flex gap-2 mt-2">
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                        </div>
                      </div>
                      {selectedTheme === theme.id && (
                        <Check className="text-green-400" size={24} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-black/50 rounded-xl border border-gray-700/50">
                <p className="text-sm text-gray-400 mb-3">Preview:</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={`px-6 py-3 rounded-xl font-bold bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.preview} text-white shadow-lg`}
                  >
                    Primary Button
                  </button>
                  <div className={`px-6 py-3 rounded-xl font-bold border-2 bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.preview} bg-clip-text text-transparent`} style={{ borderColor: themes.find(t => t.id === selectedTheme)?.primary }}>
                    Secondary Button
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeInUp">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mb-4 shadow-2xl shadow-green-500/50 animate-bounce">
                <Check className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                You're All Set!
              </h2>
              <p className="text-xl text-gray-300">
                Ready to explore the universe of physics
              </p>
            </div>

            <div className="glass-red p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Your Preferences</h3>

              <div className="space-y-6">
                {/* Selected Topics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Favorite Topics ({selectedTopics.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map(topicId => {
                      const topic = topics.find(t => t.id === topicId);
                      return (
                        <span key={topicId} className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full text-sm font-semibold flex items-center gap-2">
                          <span>{topic?.icon}</span>
                          {topic?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Theme */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Theme</h4>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.preview} shadow-lg`}></div>
                    <span className="font-bold text-white">{themes.find(t => t.id === selectedTheme)?.name}</span>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                  <h4 className="font-bold text-blue-300 mb-3">🎯 Quick Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Press <kbd className="px-2 py-1 bg-black/50 rounded text-xs">Ctrl+F</kbd> to toggle FPS counter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Complete challenges to earn XP and unlock achievements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Share your simulations publicly to climb the leaderboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Check the Formulas page for quick physics references</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden py-12">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-400">Step {step} of {totalSteps}</span>
            <span className="text-sm font-semibold text-gray-400">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-600 transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => {
              if (step === 1) {
                navigate(-1); // Go back to previous page
              } else {
                setStep(step - 1);
              }
            }}
            className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && selectedTopics.length < 2}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/50 hover:scale-105 flex items-center gap-2"
            >
              <Check size={20} />
              Get Started
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors underline"
          >
            Skip onboarding and go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
