import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, Zap, Award, CheckCircle, Lock, Play, X } from 'lucide-react';
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

  const difficultyStyle = {
    beginner: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
    advanced: 'text-orange-300 bg-orange-500/10 border-orange-500/25',
    expert: 'text-red-300 bg-red-500/10 border-red-500/30'
  } as const;

  const difficultyIcons = {
    beginner: '★',
    intermediate: '★★',
    advanced: '★★★',
    expert: '★★★★'
  } as const;

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

    const allInputsProvided = selectedChallenge.targetValues.every(
      target => userInputs[target.parameter] !== undefined
    );

    if (!allInputsProvided) {
      toast.error('Please fill in all parameters');
      setIsSubmitting(false);
      return;
    }

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
    <div className="min-h-screen bg-[#08080A] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-rose-950/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-8 sm:mb-10">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400/80 mb-2">
            Missions
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight [text-wrap:balance]">
            Physics Challenges
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl">
            Test your intuition. Solve real physics problems. Earn XP as you climb.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-mono uppercase tracking-widest">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/25 rounded-full text-red-300">
              <span className="text-white font-bold tabular-nums text-sm">{totalPoints}</span> XP
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-gray-400">
              <span className="text-white font-bold tabular-nums text-sm">{completedCount}/{challenges.length}</span> Solved
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-red-300">
              {completedCount === 0 ? 'Novice' : completedCount < 3 ? 'Apprentice' : completedCount < 6 ? 'Expert' : 'Master'}
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map((diff) => {
            const active = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                    : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => (
            <article
              key={challenge.id}
              className={`relative rounded-2xl border bg-[#0e0e10] p-5 transition-all duration-200 ${
                challenge.locked
                  ? 'border-white/[0.04] opacity-60'
                  : challenge.completed
                  ? 'border-emerald-500/25 hover:border-emerald-500/50'
                  : 'border-white/[0.06] hover:border-red-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest border ${difficultyStyle[challenge.difficulty]}`}>
                      <span>{difficultyIcons[challenge.difficulty]}</span>
                      {challenge.difficulty}
                    </span>
                    {challenge.completed && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                        <CheckCircle size={10} /> Solved
                      </span>
                    )}
                    {challenge.locked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border border-white/10 bg-white/[0.03] text-gray-500">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight mb-1">{challenge.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed [text-wrap:pretty]">{challenge.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 text-red-300 font-mono font-bold tabular-nums text-sm">
                    <Award size={12} />
                    {challenge.points}
                  </div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-gray-600 mt-0.5">XP</p>
                </div>
              </div>

              <div className="mb-3 p-3 rounded-lg border border-red-500/15 bg-red-500/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Target className="text-red-400" size={11} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-300">Objective</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{challenge.objective}</p>
              </div>

              {(challenge.timeLimit || challenge.attempts > 0) && (
                <div className="flex items-center gap-3 mb-3 text-[11px] font-mono text-gray-500 tabular-nums">
                  {challenge.timeLimit && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} /> {challenge.timeLimit}s
                    </span>
                  )}
                  {challenge.attempts > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Zap size={11} /> {challenge.attempts} tries
                    </span>
                  )}
                </div>
              )}

              <details className="mb-3 group/hints">
                <summary className="cursor-pointer list-none flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-gray-400 hover:text-red-300 transition-colors">
                  <Zap size={11} />
                  Hints · {challenge.hints.length}
                </summary>
                <ul className="mt-2 space-y-1 pl-4 border-l border-white/10">
                  {challenge.hints.map((hint, idx) => (
                    <li key={idx} className="text-xs text-gray-400 leading-relaxed">{hint}</li>
                  ))}
                </ul>
              </details>

              {challenge.locked ? (
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 text-gray-600 rounded-lg text-xs font-semibold cursor-not-allowed"
                >
                  <Lock size={12} />
                  Complete previous to unlock
                </button>
              ) : challenge.completed ? (
                <button
                  type="button"
                  onClick={() => handleStartChallenge(challenge)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  <CheckCircle size={12} />
                  Try again
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartChallenge(challenge)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md shadow-red-950/40"
                >
                  <Play size={12} />
                  Start Challenge
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('/leaderboard')}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white border-b border-white/10 hover:border-white/40 pb-1 transition-colors"
          >
            <Trophy size={14} />
            View global leaderboard
          </button>
        </div>
      </div>

      {showChallengeModal && selectedChallenge && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowChallengeModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-red-500/25 bg-[#0e0e10] p-6 shadow-2xl shadow-red-950/50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-widest uppercase text-red-400 mb-1">Challenge</p>
                <h2 className="text-xl font-black text-white leading-tight">{selectedChallenge.title}</h2>
                <p className="text-xs text-gray-400 mt-1">{selectedChallenge.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowChallengeModal(false)}
                className="shrink-0 p-1.5 hover:bg-white/[0.05] rounded-md text-gray-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-5 p-3 rounded-lg border border-red-500/20 bg-red-500/[0.05]">
              <div className="flex items-center gap-1.5 mb-1">
                <Target size={11} className="text-red-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-300">Objective</span>
              </div>
              <p className="text-xs text-gray-300">{selectedChallenge.objective}</p>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Enter values</p>
              {selectedChallenge.targetValues.map((target) => (
                <div key={target.parameter}>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 capitalize">
                    {target.parameter.replace(/([A-Z])/g, ' $1').trim()} <span className="text-gray-500 font-mono">({target.unit})</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={userInputs[target.parameter] || ''}
                    onChange={(e) => setUserInputs((prev) => ({
                      ...prev,
                      [target.parameter]: parseFloat(e.target.value)
                    }))}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 focus:border-red-500/50 rounded-md text-sm text-white font-mono tabular-nums outline-none transition-colors"
                    placeholder={`Enter value…`}
                  />
                  <p className="text-[10px] font-mono text-gray-500 mt-1 tabular-nums">
                    Target: {target.min} – {target.max} {target.unit}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-5 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap size={11} className="text-red-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Hints</span>
              </div>
              <ul className="space-y-1">
                {selectedChallenge.hints.map((hint, idx) => (
                  <li key={idx} className="text-xs text-gray-400">· {hint}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowChallengeModal(false)}
                className="flex-1 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitChallenge}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Checking…
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
