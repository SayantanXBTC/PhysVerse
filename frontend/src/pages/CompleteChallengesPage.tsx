import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, Star, Zap, Award, CheckCircle, Lock, Play, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  timeLimit?: number;
  simulation: string;
  objective: string;
  hints: string[];
  targetValues: {
    parameter: string;
    min: number;
    max: number;
    unit: string;
  }[];
  completed: boolean;
  locked: boolean;
  completedAt?: Date;
  attempts: number;
}

export default function CompleteChallengesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [userInputs, setUserInputs] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load challenges from localStorage
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Perfect Landing',
      description: 'Land the projectile exactly at the target 50m away',
      difficulty: 'beginner',
      points: 100,
      timeLimit: 300,
      simulation: 'projectile',
      objective: 'Adjust angle and velocity to hit the target within 1m accuracy',
      hints: ['Try 45° for maximum range', 'Initial velocity matters!', 'Consider air resistance'],
      targetValues: [
        { parameter: 'angle', min: 40, max: 50, unit: '°' },
        { parameter: 'velocity', min: 20, max: 25, unit: 'm/s' }
      ],
      completed: false,
      locked: false,
      attempts: 0
    },
    {
      id: '2',
      title: 'Pendulum Master',
      description: 'Create a pendulum that completes exactly 10 swings in 20 seconds',
      difficulty: 'beginner',
      points: 150,
      simulation: 'pendulum',
      objective: 'Adjust length and initial angle for precise timing',
      hints: ['Period = 2π√(L/g)', 'Longer pendulum = slower swings', 'Small angles work best'],
      targetValues: [
        { parameter: 'length', min: 0.9, max: 1.1, unit: 'm' },
        { parameter: 'angle', min: 10, max: 20, unit: '°' }
      ],
      completed: false,
      locked: false,
      attempts: 0
    },
    {
      id: '3',
      title: 'Orbital Insertion',
      description: 'Achieve a stable circular orbit around the central body',
      difficulty: 'intermediate',
      points: 250,
      simulation: 'two-body-orbit',
      objective: 'Balance velocity and distance for circular orbit',
      hints: ['v = √(GM/r)', 'Too fast = escape', 'Too slow = crash'],
      targetValues: [
        { parameter: 'velocity', min: 7.5, max: 8.5, unit: 'km/s' },
        { parameter: 'altitude', min: 350, max: 450, unit: 'km' }
      ],
      completed: false,
      locked: false,
      attempts: 0
    },
    {
      id: '4',
      title: 'Resonance Hunter',
      description: 'Find the resonant frequency of the spring-mass system',
      difficulty: 'intermediate',
      points: 300,
      timeLimit: 600,
      simulation: 'spring-mass',
      objective: 'Maximize amplitude by matching natural frequency',
      hints: ['ω = √(k/m)', 'Watch for maximum oscillation', 'Damping affects resonance'],
      targetValues: [
        { parameter: 'frequency', min: 1.8, max: 2.2, unit: 'Hz' },
        { parameter: 'amplitude', min: 0.8, max: 1.2, unit: 'm' }
      ],
      completed: false,
      locked: false,
      attempts: 0
    },
    {
      id: '5',
      title: 'Chaos Theory',
      description: 'Demonstrate sensitive dependence in double pendulum',
      difficulty: 'advanced',
      points: 400,
      simulation: 'double-pendulum',
      objective: 'Show two nearly identical initial conditions diverge',
      hints: ['Change initial angle by 0.1°', 'Watch trajectories diverge', 'Chaos emerges quickly'],
      targetValues: [
        { parameter: 'angle1', min: 45, max: 46, unit: '°' },
        { parameter: 'angle2', min: 45, max: 46, unit: '°' }
      ],
      completed: false,
      locked: false,
      attempts: 0
    },
    {
      id: '6',
      title: 'Quantum Tunneling',
      description: 'Achieve 50% tunneling probability through the barrier',
      difficulty: 'advanced',
      points: 500,
      simulation: 'quantum-tunneling',
      objective: 'Adjust particle energy and barrier height',
      hints: ['Higher energy = more tunneling', 'Barrier width matters', 'Wave-particle duality'],
      targetValues: [
        { parameter: 'energy', min: 4.5, max: 5.5, unit: 'eV' },
        { parameter: 'barrierHeight', min: 8, max: 10, unit: 'eV' }
      ],
      completed: false,
      locked: true,
      attempts: 0
    },
    {
      id: '7',
      title: 'Galaxy Merger',
      description: 'Create a stable merged galaxy from collision',
      difficulty: 'expert',
      points: 750,
      simulation: 'galaxy-collision',
      objective: 'Achieve merger without ejecting >10% of stars',
      hints: ['Approach angle is critical', 'Relative velocity matters', 'Conservation of angular momentum'],
      targetValues: [
        { parameter: 'velocity', min: 100, max: 200, unit: 'km/s' },
        { parameter: 'angle', min: 30, max: 60, unit: '°' }
      ],
      completed: false,
      locked: true,
      attempts: 0
    },
    {
      id: '8',
      title: 'Plasma Confinement',
      description: 'Maintain stable plasma for 30 seconds',
      difficulty: 'expert',
      points: 1000,
      timeLimit: 30,
      simulation: 'plasma',
      objective: 'Keep all particles within magnetic field',
      hints: ['Balance field strength', 'Temperature control', 'Toroidal geometry helps'],
      targetValues: [
        { parameter: 'fieldStrength', min: 2, max: 4, unit: 'T' },
        { parameter: 'temperature', min: 1e7, max: 1e8, unit: 'K' }
      ],
      completed: false,
      locked: true,
      attempts: 0
    }
  ]);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('challengeProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setChallenges(prev => prev.map(challenge => ({
          ...challenge,
          completed: progress[challenge.id]?.completed || false,
          completedAt: progress[challenge.id]?.completedAt ? new Date(progress[challenge.id].completedAt) : undefined,
          attempts: progress[challenge.id]?.attempts || 0,
          locked: challenge.id === '6' ? !progress['5']?.completed : 
                  challenge.id === '7' ? !progress['6']?.completed :
                  challenge.id === '8' ? !progress['7']?.completed : false
        })));
      } catch (error) {
        console.error('Failed to load challenge progress:', error);
      }
    }
  }, []);

  const saveProgress = (updatedChallenges: Challenge[]) => {
    const progress: Record<string, { completed: boolean; completedAt?: Date; attempts: number }> = {};
    updatedChallenges.forEach(challenge => {
      progress[challenge.id] = {
        completed: challenge.completed,
        completedAt: challenge.completedAt,
        attempts: challenge.attempts
      };
    });
    localStorage.setItem('challengeProgress', JSON.stringify(progress));
  };

  const difficultyColors = {
    beginner: 'from-green-500 to-emerald-500',
    intermediate: 'from-blue-500 to-cyan-500',
    advanced: 'from-orange-500 to-red-500',
    expert: 'from-purple-500 to-pink-500'
  };

  const difficultyIcons = {
    beginner: '⭐',
    intermediate: '⭐⭐',
    advanced: '⭐⭐⭐',
    expert: '⭐⭐⭐⭐'
  };

  const filteredChallenges = selectedDifficulty === 'all' 
    ? challenges 
    : challenges.filter(c => c.difficulty === selectedDifficulty);

  const totalPoints = challenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0);
  const completedCount = challenges.filter(c => c.completed).length;

  const handleStartChallenge = (challenge: Challenge) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to attempt challenges');
      navigate('/login');
      return;
    }

    if (challenge.locked) {
      toast.error('Complete previous challenges to unlock this one');
      return;
    }

    setSelectedChallenge(challenge);
    setUserInputs({});
    setShowChallengeModal(true);
  };

  const handleSubmitChallenge = () => {
    if (!selectedChallenge) return;

    setIsSubmitting(true);

    // Check if all required inputs are provided
    const allInputsProvided = selectedChallenge.targetValues.every(
      target => userInputs[target.parameter] !== undefined
    );

    if (!allInputsProvided) {
      toast.error('Please fill in all parameters');
      setIsSubmitting(false);
      return;
    }

    // Validate inputs against target values
    const allCorrect = selectedChallenge.targetValues.every(target => {
      const userValue = userInputs[target.parameter];
      return userValue >= target.min && userValue <= target.max;
    });

    setTimeout(() => {
      const updatedChallenges = challenges.map(c => {
        if (c.id === selectedChallenge.id) {
          return {
            ...c,
            attempts: c.attempts + 1,
            completed: allCorrect ? true : c.completed,
            completedAt: allCorrect && !c.completed ? new Date() : c.completedAt
          };
        }
        return c;
      });

      // Unlock next challenge if this one is completed
      if (allCorrect) {
        const currentIndex = challenges.findIndex(c => c.id === selectedChallenge.id);
        if (currentIndex < challenges.length - 1) {
          updatedChallenges[currentIndex + 1].locked = false;
        }
      }

      setChallenges(updatedChallenges);
      saveProgress(updatedChallenges);

      if (allCorrect) {
        toast.success(`🎉 Challenge completed! +${selectedChallenge.points} points`);
        setShowChallengeModal(false);
      } else {
        toast.error('Not quite right. Check the hints and try again!');
      }

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Trophy className="text-purple-400" size={20} />
            <span className="text-purple-300 text-sm font-medium">Physics Challenges</span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Test Your Skills
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete challenges, earn points, and master physics concepts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-red p-6 rounded-2xl text-center">
            <Trophy className="mx-auto mb-3 text-yellow-400" size={32} />
            <div className="text-3xl font-black text-white mb-1">{totalPoints}</div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
          <div className="glass-red p-6 rounded-2xl text-center">
            <CheckCircle className="mx-auto mb-3 text-green-400" size={32} />
            <div className="text-3xl font-black text-white mb-1">{completedCount}/{challenges.length}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="glass-red p-6 rounded-2xl text-center">
            <Star className="mx-auto mb-3 text-purple-400" size={32} />
            <div className="text-3xl font-black text-white mb-1">
              {completedCount === 0 ? 'Novice' : completedCount < 3 ? 'Apprentice' : completedCount < 6 ? 'Expert' : 'Master'}
            </div>
            <div className="text-sm text-gray-400">Rank</div>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`glass-red p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                challenge.locked 
                  ? 'border-gray-700/50 opacity-60' 
                  : challenge.completed
                  ? 'border-green-500/50'
                  : 'border-purple-500/30 hover:border-purple-500/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${difficultyColors[challenge.difficulty]} text-white`}>
                      {difficultyIcons[challenge.difficulty]} {challenge.difficulty.toUpperCase()}
                    </span>
                    {challenge.completed && (
                      <CheckCircle className="text-green-400" size={20} />
                    )}
                    {challenge.locked && (
                      <Lock className="text-gray-500" size={20} />
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{challenge.title}</h3>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-black text-xl">
                  <Award size={24} />
                  {challenge.points}
                </div>
              </div>

              {/* Objective */}
              <div className="mb-4 p-4 bg-black/30 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-purple-400" size={16} />
                  <span className="text-sm font-bold text-purple-300">Objective</span>
                </div>
                <p className="text-sm text-gray-300">{challenge.objective}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                {challenge.timeLimit && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={16} />
                    <span>Time Limit: {challenge.timeLimit}s</span>
                  </div>
                )}
                {challenge.attempts > 0 && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Zap size={16} />
                    <span>Attempts: {challenge.attempts}</span>
                  </div>
                )}
              </div>

              {/* Hints */}
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                  <Zap size={16} />
                  Show Hints ({challenge.hints.length})
                </summary>
                <ul className="mt-3 space-y-2 pl-6">
                  {challenge.hints.map((hint, idx) => (
                    <li key={idx} className="text-sm text-gray-400 list-disc">
                      {hint}
                    </li>
                  ))}
                </ul>
              </details>

              {/* Action Button */}
              {challenge.locked ? (
                <button
                  type="button"
                  disabled
                  className="w-full px-6 py-3 bg-gray-700/50 text-gray-500 rounded-xl font-bold cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Lock size={20} />
                    Complete previous challenges to unlock
                  </div>
                </button>
              ) : challenge.completed ? (
                <button
                  type="button"
                  onClick={() => handleStartChallenge(challenge)}
                  className="w-full px-6 py-3 bg-green-500/20 border-2 border-green-500/50 text-green-400 rounded-xl font-bold hover:bg-green-500/30 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Completed - Try Again
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartChallenge(challenge)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play size={20} />
                    Start Challenge
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Leaderboard Teaser */}
        <div className="mt-12 glass-red p-8 rounded-2xl text-center border-2 border-purple-500/30">
          <Trophy className="mx-auto mb-4 text-yellow-400" size={48} />
          <h3 className="text-2xl font-black text-white mb-2">Global Leaderboard</h3>
          <p className="text-gray-400 mb-6">
            Compete with physics enthusiasts worldwide!
          </p>
          <button
            type="button"
            onClick={() => navigate('/leaderboard')}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/50"
          >
            View Leaderboard
          </button>
        </div>
      </div>

      {/* Challenge Modal */}
      {showChallengeModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-red p-8 rounded-2xl max-w-2xl w-full animate-bounceIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">{selectedChallenge.title}</h2>
                <p className="text-gray-400">{selectedChallenge.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowChallengeModal(false)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                aria-label="Close modal"
              >
                <X size={24} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Objective */}
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <h3 className="font-bold text-purple-300 mb-2">🎯 Objective</h3>
              <p className="text-gray-300">{selectedChallenge.objective}</p>
            </div>

            {/* Input Parameters */}
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-white text-lg">Enter Your Values:</h3>
              {selectedChallenge.targetValues.map((target) => (
                <div key={target.parameter}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {target.parameter.replace(/([A-Z])/g, ' $1').trim()} ({target.unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={userInputs[target.parameter] || ''}
                    onChange={(e) => setUserInputs(prev => ({
                      ...prev,
                      [target.parameter]: parseFloat(e.target.value)
                    }))}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-purple-500/50 text-white"
                    placeholder={`Enter ${target.parameter}...`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Target range: {target.min} - {target.max} {target.unit}
                  </p>
                </div>
              ))}
            </div>

            {/* Hints */}
            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <h3 className="font-bold text-cyan-300 mb-2">💡 Hints</h3>
              <ul className="space-y-1">
                {selectedChallenge.hints.map((hint, idx) => (
                  <li key={idx} className="text-sm text-gray-300">• {hint}</li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmitChallenge}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Checking...
                  </div>
                ) : (
                  'Submit Solution'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowChallengeModal(false)}
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
