import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Zap, Globe, Lock, Sparkles, Atom, Waves, Wind, Orbit, FlaskConical, Brain, TrendingUp, Trophy, BookOpen, Target, Calculator, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import PhysicistOrbitCarousel from '../components/PhysicistOrbitCarousel';
import { BlackHoleHeroSection } from '@/components/ui/blackhole-hero-section';
import LiveSimulationPreview, { type PreviewVariant } from '../components/LiveSimulationPreview';

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)');
    setMobile(m.matches);
    const cb = (e: MediaQueryListEvent) => setMobile(e.matches);
    m.addEventListener('change', cb);
    return () => m.removeEventListener('change', cb);
  }, []);
  return mobile;
}

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ö/g, 'o')
      .replace(/ä/g, 'a')
      .replace(/ü/g, 'u')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const physicists = [
    { 
      name: 'Isaac Newton', 
      years: '1643-1727', 
      contribution: 'Laws of Motion & Universal Gravitation', 
      imagePath: '/physicists/newton.jpg',
      simulations: 'Projectile Motion, Two-Body Orbit',
      quote: 'If I have seen further, it is by standing on the shoulders of giants.'
    },
    { 
      name: 'Galileo Galilei', 
      years: '1564-1642', 
      contribution: 'Kinematics & Pendulum Motion', 
      imagePath: '/physicists/galileo.jpg',
      simulations: 'Pendulum, Projectile Motion',
      quote: 'All truths are easy to understand once they are discovered.'
    },
    { 
      name: 'Robert Hooke', 
      years: '1635-1703', 
      contribution: "Hooke's Law of Elasticity", 
      imagePath: '/physicists/hooke.jpg',
      simulations: 'Spring-Mass System',
      quote: 'The truth is, the science of Nature has been already too long made only a work of the brain.'
    },
    { 
      name: 'Johannes Kepler', 
      years: '1571-1630', 
      contribution: 'Laws of Planetary Motion', 
      imagePath: '/physicists/kepler.jpg',
      simulations: 'Solar System, Orbital Mechanics',
      quote: 'Nature uses as little as possible of anything.'
    },
    { 
      name: 'Albert Einstein', 
      years: '1879-1955', 
      contribution: 'Theory of Relativity', 
      imagePath: '/physicists/einstein.jpg',
      simulations: 'Relativistic Particles, Black Holes',
      quote: 'Imagination is more important than knowledge.'
    },
    { 
      name: 'Erwin Schrödinger', 
      years: '1887-1961', 
      contribution: 'Quantum Mechanics', 
      imagePath: '/physicists/schrodinger.jpg',
      simulations: 'Quantum Tunneling, Wave Functions',
      quote: 'The task is not to see what has never been seen before, but to think what has never been thought before.'
    },
    { 
      name: 'James Clerk Maxwell', 
      years: '1831-1879', 
      contribution: 'Electromagnetic Theory', 
      imagePath: '/physicists/maxwell.jpg',
      simulations: 'Electromagnetic Waves, Magnetic Fields',
      quote: 'The true logic of this world is in the calculus of probabilities.'
    },
  ];

  const simulations: Array<{
    name: string;
    icon: typeof Orbit;
    color: string;
    description: string;
    glow: string;
    variant: PreviewVariant;
  }> = [
    { name: 'Solar System', icon: Orbit, color: 'from-red-500 to-orange-500', description: 'Planetary orbits', glow: 'shadow-red-500/50', variant: 'solar' },
    { name: 'Wave Motion', icon: Waves, color: 'from-red-600 to-red-400', description: '3D wave dynamics', glow: 'shadow-red-600/50', variant: 'wave' },
    { name: 'Double Pendulum', icon: TrendingUp, color: 'from-rose-500 to-red-500', description: 'Chaotic motion', glow: 'shadow-rose-500/50', variant: 'pendulum' },
    { name: 'Rocket Launch', icon: Rocket, color: 'from-red-500 to-orange-600', description: 'Thrust & drag', glow: 'shadow-orange-500/50', variant: 'rocket' },
    { name: 'DNA Helix', icon: FlaskConical, color: 'from-red-400 to-pink-500', description: 'Molecular structure', glow: 'shadow-pink-500/50', variant: 'dna' },
    { name: 'Fluid Dynamics', icon: Wind, color: 'from-red-600 to-red-800', description: 'Particle fluids', glow: 'shadow-red-700/50', variant: 'fluid' },
    { name: 'Lorenz Attractor', icon: Brain, color: 'from-red-500 to-rose-600', description: 'Strange attractor', glow: 'shadow-red-500/50', variant: 'lorenz' },
    { name: 'Magnetic Field', icon: Atom, color: 'from-pink-500 to-red-500', description: 'Field lines', glow: 'shadow-pink-500/50', variant: 'magnetic' },
  ];



  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Ambient — reduced from 4 blur blobs to 2 static (blackhole handles hero light) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/12 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section — black hole raymarched backdrop (perf-tuned for mobile) */}
      <BlackHoleHeroSection
        focus={isMobile ? [0.5, 0.75] : [0.75, 0.5]}
        scrim={isMobile ? 'top' : 'left'}
        scrimStrength={0.85}
        hotColor="#FFD9DA"
        midColor="#E5484D"
        coolColor="#3A0508"
        elevation={-6}
        roll={-18}
        fov={isMobile ? 58 : 44}
        glow={isMobile ? 0.8 : 1.1}
        exposure={0.95}
        vignette={0.35}
        steps={isMobile ? 160 : 220}
        resolution={isMobile ? 0.5 : 0.6}
        maxDpr={isMobile ? 1.25 : 1.5}
        className="min-h-[92vh]"
      >
      <div className={`relative max-w-7xl mx-auto container-mobile pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-24 gpu-accelerated min-h-[92vh] flex ${isMobile ? 'items-start' : 'items-center'}`}>
        <div className={`animate-fadeInUp page-transition max-w-2xl ${isMobile ? 'text-center mx-auto' : 'text-left'}`}>
          <h1 className="title-responsive title-safe font-black mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight [text-wrap:balance]">
            PhysVerse
          </h1>

          <p className="subtitle-responsive text-gray-100 mb-3 sm:mb-4 lg:mb-6 font-light tracking-wide [text-wrap:balance]">
            Where physics comes <span className="text-red-500 font-semibold">alive</span>
          </p>

          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-200 mb-6 sm:mb-8 lg:mb-12 max-w-xl leading-relaxed [text-wrap:pretty]">
            Change the conditions. Watch the laws respond. Create, share, and explore interactive
            simulations across mechanics, quantum, relativity, and more.
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16">
              <div className="flex items-center gap-3 px-6 py-3 bg-red-950/30 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <span className="text-white font-semibold">Welcome, {user?.name || 'User'}!</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="group relative button-responsive touch-target bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-2xl shadow-red-500/50 hover:shadow-red-500/80 hover:scale-105 sm:hover:scale-110 overflow-hidden active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <LogOut size={18} />
                  <span className="text-sm sm:text-base lg:text-lg">Sign Out</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </button>
              
              <Link 
                to="/dashboard" 
                className="button-responsive touch-target bg-black/60 hover:bg-red-950/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 backdrop-blur-md hover:scale-105 sm:hover:scale-110 shadow-lg shadow-red-900/30 hover:shadow-red-500/40 active:scale-95 text-sm sm:text-base lg:text-lg"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16">
              <Link 
                to="/preview" 
                className="group relative button-responsive touch-target bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-2xl shadow-red-500/50 hover:shadow-red-500/80 hover:scale-105 sm:hover:scale-110 overflow-hidden active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket size={18} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-sm sm:text-base lg:text-lg">Try a simulation</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </Link>
              
              <Link 
                to="/login" 
                className="button-responsive touch-target bg-black/60 hover:bg-red-950/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 backdrop-blur-md hover:scale-105 sm:hover:scale-110 shadow-lg shadow-red-900/30 hover:shadow-red-500/40 active:scale-95 text-sm sm:text-base lg:text-lg"
              >
                Sign In
              </Link>
              
              <Link 
                to="/gallery" 
                className="button-responsive touch-target bg-black/60 hover:bg-gray-900/60 border-2 border-gray-700/50 hover:border-red-500/30 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 backdrop-blur-md hover:scale-105 sm:hover:scale-110 active:scale-95 text-sm sm:text-base lg:text-lg"
              >
                Explore Gallery
              </Link>
            </div>
          )}

        </div>
      </div>
      </BlackHoleHeroSection>

      <PhysicistOrbitCarousel physicists={physicists} createSlug={createSlug} />

      <div className="relative max-w-7xl mx-auto container-mobile py-12 sm:py-16 lg:py-24">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent [text-wrap:balance]">
            Simulations
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto px-4 [text-wrap:pretty]">
            From classical mechanics to chaotic systems.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] gap-4 sm:gap-5">
          {simulations.map((sim, index) => {
            const featured = index === 0;
            return (
              <Link
                key={sim.name}
                to={`/simulation-info/${sim.name.toLowerCase().replace(/\s+/g, '-')}`}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
                className={`group relative bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-sm border-2 ${
                  isHovering === index ? 'border-red-500/70' : 'border-red-500/20'
                } rounded-2xl transition-all duration-300 hover:shadow-2xl ${sim.glow} cursor-pointer block overflow-hidden ${
                  featured ? 'col-span-2 row-span-2' : ''
                }`}
              >
                {/* Live preview — desktop only for perf */}
                {!isMobile && (
                  <div className="absolute inset-0 opacity-100">
                    <LiveSimulationPreview variant={sim.variant} intensity={1.8} />
                  </div>
                )}
                {/* Readability scrim — only bottom third, keeps sim visible */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none" />

                <div className={`relative h-full flex flex-col ${featured ? 'p-8 sm:p-10' : 'p-5 sm:p-6'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex ${featured ? 'p-4' : 'p-2.5'} rounded-2xl bg-gradient-to-br ${sim.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${sim.glow} backdrop-blur-sm`}>
                      <sim.icon className="text-white" size={featured ? 26 : 18} />
                    </div>
                    <span className="font-mono text-[10px] text-red-300/80 tabular-nums tracking-widest drop-shadow">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-end space-y-1.5">
                    <h3 className={`font-bold text-white leading-tight drop-shadow-lg ${featured ? 'text-2xl sm:text-3xl' : 'text-base'}`}>
                      {sim.name}
                    </h3>
                    <p className={`text-gray-200 leading-relaxed line-clamp-2 drop-shadow ${featured ? 'text-base max-w-md' : 'text-xs'}`}>
                      {sim.description}
                    </p>
                    {featured && (
                      <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold tracking-widest uppercase mt-3 drop-shadow">
                        Featured Simulation →
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-red-400/90 text-[9px] font-mono uppercase tracking-widest mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent [text-wrap:balance]">
            More than simulations
          </h2>
          <p className="text-lg text-gray-300 [text-wrap:pretty]">
            Missions, references, and a personal lab.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link
            to="/challenges"
            className="group relative p-12 bg-gradient-to-br from-red-950/50 via-black/60 to-rose-950/40 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl hover:border-red-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-red-500/50">
                  <Trophy className="text-white" size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white mb-2 [text-wrap:balance]">Physics Challenges</h3>
                  <p className="text-red-300 font-semibold">Test your skills & earn points</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Take on missions from beginner to expert. Master physics through hands-on problem solving
                and climb the leaderboard.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs font-medium">
                  Beginner
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs font-medium">
                  Intermediate
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs font-medium">
                  Advanced
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs font-medium">
                  Expert
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-red-400 font-bold text-lg group-hover:gap-4 transition-all">
                <Target size={24} />
                <span>Start Challenges</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>

          <Link
            to="/formulas"
            className="group relative p-12 bg-gradient-to-br from-rose-950/50 via-black/60 to-red-950/40 backdrop-blur-xl border-2 border-rose-500/30 rounded-3xl hover:border-rose-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-rose-600 to-red-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-rose-500/50">
                  <BookOpen className="text-white" size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white mb-2 [text-wrap:balance]">Formula Library</h3>
                  <p className="text-rose-300 font-semibold">Essential physics reference</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                A physics reference. Variables, applications, and worked context for every entry.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-full text-gray-300 text-sm font-bold">
                  Mechanics
                </span>
                <span className="px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-full text-gray-300 text-sm font-bold">
                  Quantum
                </span>
                <span className="px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-full text-gray-300 text-sm font-bold">
                  Relativity
                </span>
                <span className="px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-full text-gray-300 text-sm font-bold">
                  Thermodynamics
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-rose-400 font-bold text-lg group-hover:gap-4 transition-all">
                <Calculator size={24} />
                <span>Browse Formulas</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent [text-wrap:balance]">Built for exploration</h2>
          <p className="text-lg text-gray-300 [text-wrap:pretty]">Everything the lab needs. Nothing more.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {[
            { icon: Rocket, title: 'Realtime 3D', metric: '< 16ms frame', copy: 'WebGL sims rendered smoothly in your browser.', grad: 'from-red-600 to-red-700', shadow: 'shadow-red-500/40' },
            { icon: Zap, title: 'Live controls', metric: '∞ parameters', copy: 'Adjust parameters. Watch physics respond.', grad: 'from-red-500 to-rose-600', shadow: 'shadow-rose-500/40' },
            { icon: Globe, title: 'Cloud sync', metric: '< 200ms save', copy: 'Save experiments. Open from anywhere.', grad: 'from-rose-600 to-red-700', shadow: 'shadow-rose-500/40' },
            { icon: Lock, title: 'Share or keep', metric: 'public / private', copy: 'Public gallery or private lab.', grad: 'from-red-700 to-rose-700', shadow: 'shadow-red-500/40' },
          ].map((f) => (
            <div key={f.title} className="group relative p-6 bg-gradient-to-br from-red-950/30 to-black/70 backdrop-blur-md border border-red-500/25 rounded-2xl hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 min-w-0">
              <div className={`p-2.5 bg-gradient-to-br ${f.grad} rounded-xl w-fit mb-4 shadow-lg ${f.shadow} group-hover:scale-110 transition-transform`}>
                <f.icon className="text-white" size={20} />
              </div>
              <h3 className="text-base font-bold mb-1 text-white whitespace-nowrap">{f.title}</h3>
              <p className="font-mono text-[10px] tracking-wider uppercase text-red-400/80 mb-3 tabular-nums">{f.metric}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative p-16 md:p-20 bg-gradient-to-br from-red-950/50 via-black/60 to-red-900/40 backdrop-blur-xl border-2 border-red-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/50">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative text-center z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-5 bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent [text-wrap:balance]">
              Enter PhysVerse
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed [text-wrap:pretty]">
              Curiosity is the beginning.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105"
              >
                Create account
              </Link>
              <Link
                to="/preview"
                className="inline-block px-8 py-4 bg-black/60 hover:bg-red-950/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-md hover:scale-105"
              >
                Try a simulation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
