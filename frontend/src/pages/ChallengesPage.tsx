import { useState } from 'react';
import { Trophy, Target, Clock, Star, Zap, Award, CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  completed: boolean;
  locked: boolean;
}

export default function ChallengesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const challenges: Challenge[] = [
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
      completed: false,
      locked: false
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
      completed: false,
      locked: false
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
      completed: false,
      locked: false
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
      completed: false,
      locked: false
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
      completed: false,
      locked: false
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
      completed: false,
      locked: true
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
      completed: false,
      locked: true
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
      completed: false,
      locked: true
    }
  ];

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

              {/* Time Limit */}
              {challenge.timeLimit && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                  <Clock size={16} />
                  <span>Time Limit: {challenge.timeLimit}s</span>
                </div>
              )}

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
                  className="w-full px-6 py-3 bg-green-500/20 border-2 border-green-500/50 text-green-400 rounded-xl font-bold hover:bg-green-500/30 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Completed - Try Again
                  </div>
                </button>
              ) : (
                <Link
                  to={`/challenge/${challenge.id}`}
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-center transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Target size={20} />
                    Start Challenge
                  </div>
                </Link>
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
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/50"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
