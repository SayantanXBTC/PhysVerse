import { Link } from 'react-router-dom';
import { Rocket, Zap, Globe, Lock, Sparkles, Atom, Waves, Wind, Orbit, FlaskConical, Brain, TrendingUp, Trophy, BookOpen, Target, Calculator } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState<number | null>(null);

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

  const simulations = [
    { name: 'Solar System', icon: Orbit, color: 'from-red-500 to-orange-500', description: 'Planetary orbits', glow: 'shadow-red-500/50' },
    { name: 'Wave Motion', icon: Waves, color: 'from-red-600 to-red-400', description: '3D wave dynamics', glow: 'shadow-red-600/50' },
    { name: 'Double Pendulum', icon: TrendingUp, color: 'from-rose-500 to-red-500', description: 'Chaotic motion', glow: 'shadow-rose-500/50' },
    { name: 'Rocket Launch', icon: Rocket, color: 'from-red-500 to-orange-600', description: 'Thrust & drag', glow: 'shadow-orange-500/50' },
    { name: 'DNA Helix', icon: FlaskConical, color: 'from-red-400 to-pink-500', description: 'Molecular structure', glow: 'shadow-pink-500/50' },
    { name: 'Fluid Dynamics', icon: Wind, color: 'from-red-600 to-red-800', description: 'Particle fluids', glow: 'shadow-red-700/50' },
    { name: 'Lorenz Attractor', icon: Brain, color: 'from-red-500 to-rose-600', description: 'Strange attractor', glow: 'shadow-red-500/50' },
    { name: 'Magnetic Field', icon: Atom, color: 'from-pink-500 to-red-500', description: 'Field lines', glow: 'shadow-pink-500/50' },
  ];



  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated red glow background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Particle grid effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto container-mobile pt-8 sm:pt-12 lg:pt-20 pb-12 sm:pb-16 lg:pb-24 gpu-accelerated">
        <div className="text-center animate-fadeInUp page-transition">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-red-950/40 border border-red-500/30 rounded-full mb-6 sm:mb-8 backdrop-blur-md hover:border-red-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <Sparkles className="text-red-400 animate-pulse" size={16} />
            <span className="text-red-300 text-xs sm:text-sm font-semibold tracking-wide">30+ Physics Simulations Available</span>
          </div>
          
          <h1 className="title-responsive title-safe font-black mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent drop-shadow-2xl animate-gradient tracking-tight break-words overflow-visible px-2">
            PhysVerse
          </h1>
          
          <p className="subtitle-responsive text-gray-100 mb-3 sm:mb-4 lg:mb-6 font-light tracking-wide break-words px-2">
            Where Physics Comes <span className="text-red-500 font-semibold">Alive</span>
          </p>
          
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed break-words px-4">
            Experience the beauty of physics through <span className="text-red-400 font-semibold">stunning 3D visualizations</span>. Create, explore, and share 
            interactive simulations from quantum mechanics to celestial dynamics.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 px-4">
            <Link 
              to="/preview" 
              className="group relative button-responsive touch-target bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-2xl shadow-red-500/50 hover:shadow-red-500/80 hover:scale-105 sm:hover:scale-110 overflow-hidden active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Rocket size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="text-sm sm:text-base lg:text-lg">Try It Now - Free!</span>
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

          {/* Stats with glow effect */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 max-w-3xl mx-auto px-2 sm:px-4">
            <div className="group text-center card-responsive bg-red-950/20 border border-red-500/20 rounded-lg sm:rounded-xl lg:rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm active:scale-95">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">30+</div>
              <div className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">Simulations</div>
            </div>
            <div className="group text-center card-responsive bg-red-950/20 border border-red-500/20 rounded-lg sm:rounded-xl lg:rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm active:scale-95">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">60 FPS</div>
              <div className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">Performance</div>
            </div>
            <div className="group text-center card-responsive bg-red-950/20 border border-red-500/20 rounded-lg sm:rounded-xl lg:rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm active:scale-95">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-rose-400 to-red-600 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">Browser-Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Physicist Carousel - Infinite Scroll */}
      <div className="relative w-full py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 container-mobile">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent animate-gradient break-words px-2">
            The Scientists Who Changed the World
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed break-words px-4">
            Standing on the shoulders of <span className="text-red-400 font-bold">giants</span> - explore the minds behind the simulations
          </p>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Infinite scroll */}
        <div className="relative">
          {/* Gradient overlays for fade effect - hidden on mobile */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 lg:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 lg:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

          {/* Mobile carousel */}
          <div className="sm:hidden mobile-carousel flex gap-4 px-4 pb-4">
            {physicists.map((physicist, index) => (
              <Link
                key={index}
                to={`/physicist/${physicist.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="mobile-carousel-item w-80 flex-shrink-0 group block"
              >
                <div className="relative h-full bg-gradient-to-br from-red-950/60 via-black/80 to-red-900/50 backdrop-blur-xl border-2 border-red-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-red-900/50 transition-all duration-500 hover:scale-105 hover:border-red-500/60 hover:shadow-red-500/40 cursor-pointer">
                  {/* Mobile card content - simplified */}
                  <div className="relative z-10 p-4">
                    <div className="relative mb-4">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-red-500/50 shadow-xl">
                        <img 
                          src={physicist.imagePath}
                          alt={physicist.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="192"%3E%3Crect fill="%23991b1b" width="320" height="192"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%23fca5a5"%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-xl font-black text-white mb-1 break-words">
                            {physicist.name}
                          </h3>
                          <p className="text-red-300 text-xs font-bold">{physicist.years}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-red-950/40 border-l-4 border-red-500 rounded-r-lg">
                      <p className="text-xs text-red-300 font-bold mb-1 uppercase tracking-wider">Contribution</p>
                      <p className="text-sm text-white font-semibold leading-relaxed break-words">{physicist.contribution}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop infinite scroll */}
          <div className="hidden sm:flex animate-scroll-left hover:pause-animation gpu-accelerated">
            {[...physicists, ...physicists].map((physicist, index) => (
              <Link
                key={index}
                to={`/physicist/${physicist.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 w-80 lg:w-96 mx-2 lg:mx-4 group block"
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="relative h-full bg-gradient-to-br from-red-950/60 via-black/80 to-red-900/50 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/50 transition-all duration-500 hover:scale-105 hover:border-red-500/60 hover:shadow-red-500/40 cursor-pointer">
                  {/* Desktop card content - full version */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 p-6 lg:p-8">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-rose-500/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden border-4 border-red-500/50 shadow-2xl group-hover:border-red-400/80 transition-all duration-500">
                        <img 
                          src={physicist.imagePath}
                          alt={physicist.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="320"%3E%3Crect fill="%23991b1b" width="320" height="320"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23fca5a5"%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-lg break-words">
                            {physicist.name}
                          </h3>
                          <p className="text-red-300 text-sm font-bold">{physicist.years}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-4 bg-red-950/40 border-l-4 border-red-500 rounded-r-xl backdrop-blur-sm group-hover:bg-red-950/60 transition-colors duration-300">
                      <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wider">Major Contribution</p>
                      <p className="text-sm text-white font-semibold leading-relaxed break-words">{physicist.contribution}</p>
                    </div>

                    <div className="mb-4 p-4 bg-black/50 border border-red-500/20 rounded-xl backdrop-blur-sm group-hover:border-red-500/40 transition-colors duration-300">
                      <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wider">Famous Quote</p>
                      <p className="text-sm text-gray-200 italic leading-relaxed break-words">"{physicist.quote}"</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-red-950/50 to-rose-950/50 border border-red-500/30 rounded-xl backdrop-blur-sm group-hover:from-red-950/70 group-hover:to-rose-950/70 transition-colors duration-300">
                      <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wider">Featured In</p>
                      <p className="text-sm text-white font-medium break-words">{physicist.simulations}</p>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-xs font-black text-white shadow-lg shadow-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    LEGEND
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Interaction hint */}
        <div className="text-center mt-8 sm:mt-12 container-mobile">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">
            <span className="sm:hidden">Swipe to explore more scientists</span>
            <span className="hidden sm:inline">Hover over a card to pause and explore</span>
          </p>
        </div>
      </div>

      {/* Simulations Showcase */}
      <div className="relative max-w-7xl mx-auto container-mobile py-12 sm:py-16 lg:py-24">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
            Explore Our Simulations
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            From classical mechanics to chaotic systems, discover physics in <span className="text-red-400 font-semibold">stunning detail</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {simulations.map((sim, index) => (
            <Link
              key={sim.name}
              to={`/simulation-info/${sim.name.toLowerCase().replace(/\s+/g, '-')}`}
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
              className={`group relative bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-sm border-2 ${
                isHovering === index ? 'border-red-500/70 scale-105' : 'border-red-500/20'
              } rounded-xl lg:rounded-2xl transition-all duration-300 hover:shadow-2xl ${sim.glow} cursor-pointer block touch-target overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                {/* Icon Container */}
                <div className="flex justify-start mb-4 sm:mb-6">
                  <div className={`inline-flex p-3 sm:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br ${sim.color} group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg ${sim.glow}`}>
                    <sim.icon className="text-white" size={20} />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="flex-1 space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white break-words leading-tight">
                    {sim.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 break-words leading-relaxed line-clamp-2">
                    {sim.description}
                  </p>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className={`absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-br from-red-500/0 to-rose-500/0 ${
                isHovering === index ? 'from-red-500/10 to-rose-500/10' : ''
              } transition-all duration-300 pointer-events-none`}></div>
            </Link>
          ))}
        </div>
      </div>

      {/* New Features Showcase */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            More Than Just Simulations
          </h2>
          <p className="text-xl text-gray-300">
            A complete <span className="text-red-400 font-semibold">physics learning ecosystem</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Challenges Card */}
          <Link
            to="/challenges"
            className="group relative p-12 bg-gradient-to-br from-purple-950/40 via-black/60 to-pink-950/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl hover:border-purple-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-purple-500/50">
                  <Trophy className="text-white" size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white mb-2">Physics Challenges</h3>
                  <p className="text-purple-300 font-semibold">Test your skills & earn points</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Take on <span className="text-purple-400 font-bold">8 exciting challenges</span> from beginner to expert level. 
                Master physics concepts through hands-on problem solving and compete on the global leaderboard.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-bold">
                  ⭐ Beginner
                </span>
                <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-bold">
                  ⭐⭐ Intermediate
                </span>
                <span className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-bold">
                  ⭐⭐⭐ Advanced
                </span>
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-bold">
                  ⭐⭐⭐⭐ Expert
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-purple-400 font-bold text-lg group-hover:gap-4 transition-all">
                <Target size={24} />
                <span>Start Challenges</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>

          {/* Formulas Card */}
          <Link
            to="/formulas"
            className="group relative p-12 bg-gradient-to-br from-blue-950/40 via-black/60 to-cyan-950/40 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl hover:border-blue-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl shadow-blue-500/50">
                  <BookOpen className="text-white" size={48} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white mb-2">Formula Library</h3>
                  <p className="text-blue-300 font-semibold">Essential physics reference</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Access <span className="text-blue-400 font-bold">63 essential formulas</span> with detailed explanations, 
                variable definitions, and real-world applications. Your complete physics reference guide.
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
              
              <div className="flex items-center gap-2 text-blue-400 font-bold text-lg group-hover:gap-4 transition-all">
                <Calculator size={24} />
                <span>Browse Formulas</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">Powerful Features</h2>
          <p className="text-xl text-gray-300">Everything you need for <span className="text-red-400 font-semibold">physics simulation</span></p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group p-10 bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-md border-2 border-red-500/20 rounded-3xl hover:border-red-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-xl shadow-red-500/50">
                <Rocket className="text-white" size={36} />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 text-center text-white">Real-time 3D</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              WebGL-powered simulations with buttery smooth <span className="text-red-400 font-semibold">60 FPS</span> performance
            </p>
          </div>

          <div className="group p-10 bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-md border-2 border-red-500/20 rounded-3xl hover:border-red-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-xl shadow-orange-500/50">
                <Zap className="text-white" size={36} />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 text-center text-white">Interactive Controls</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Adjust parameters in <span className="text-red-400 font-semibold">real-time</span> and see instant results
            </p>
          </div>

          <div className="group p-10 bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-md border-2 border-red-500/20 rounded-3xl hover:border-red-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-xl shadow-rose-500/50">
                <Globe className="text-white" size={36} />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 text-center text-white">Cloud Sync</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Save your work and access it from <span className="text-red-400 font-semibold">any device</span>, anywhere
            </p>
          </div>

          <div className="group p-10 bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-md border-2 border-red-500/20 rounded-3xl hover:border-red-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30">
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-xl shadow-pink-500/50">
                <Lock className="text-white" size={36} />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 text-center text-white">Share & Collaborate</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Share your simulations <span className="text-red-400 font-semibold">publicly</span> or keep them private
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative p-16 md:p-20 bg-gradient-to-br from-red-950/50 via-black/60 to-red-900/40 backdrop-blur-xl border-2 border-red-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/50">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative text-center z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h2>
            <p className="text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join <span className="text-red-400 font-bold">PhysVerse</span> today and unlock the power of <span className="text-red-400 font-bold">interactive physics simulation</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/signup" 
                className="group relative inline-block px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-black text-2xl transition-all duration-300 shadow-2xl shadow-red-500/60 hover:shadow-red-500/80 hover:scale-110 overflow-hidden"
              >
                <span className="relative z-10">Create Free Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-40 transition-opacity"></div>
              </Link>
              <Link 
                to="/preview" 
                className="inline-block px-12 py-6 bg-black/60 hover:bg-red-950/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-2xl font-black text-2xl transition-all duration-300 backdrop-blur-md hover:scale-110 shadow-lg shadow-red-900/30"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
}
