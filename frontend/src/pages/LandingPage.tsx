import { Link } from 'react-router-dom';
import { Rocket, Zap, Globe, Lock, Sparkles, Atom, Waves, Wind, Orbit, FlaskConical, Brain, TrendingUp } from 'lucide-react';
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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="text-center animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-950/40 border border-red-500/30 rounded-full mb-8 backdrop-blur-md hover:border-red-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <Sparkles className="text-red-400 animate-pulse" size={20} />
            <span className="text-red-300 text-sm font-semibold tracking-wide">30+ Physics Simulations Available</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent drop-shadow-2xl animate-gradient tracking-tight px-4">
            PhysVerse
          </h1>
          
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-100 mb-4 sm:mb-6 font-light tracking-wide px-4">
            Where Physics Comes <span className="text-red-500 font-semibold">Alive</span>
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Experience the beauty of physics through <span className="text-red-400 font-semibold">stunning 3D visualizations</span>. Create, explore, and share 
            interactive simulations from quantum mechanics to celestial dynamics.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
            <Link 
              to="/preview" 
              className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-2xl shadow-red-500/50 hover:shadow-red-500/80 hover:scale-105 sm:hover:scale-110 overflow-hidden active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                Try It Now - Free!
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </Link>
            
            <Link 
              to="/login" 
              className="px-6 sm:px-10 py-4 sm:py-5 bg-black/60 hover:bg-red-950/40 border-2 border-red-500/40 hover:border-red-500/70 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 backdrop-blur-md hover:scale-105 sm:hover:scale-110 shadow-lg shadow-red-900/30 hover:shadow-red-500/40 active:scale-95"
            >
              Sign In
            </Link>
            
            <Link 
              to="/gallery" 
              className="px-6 sm:px-10 py-4 sm:py-5 bg-black/60 hover:bg-gray-900/60 border-2 border-gray-700/50 hover:border-red-500/30 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 backdrop-blur-md hover:scale-105 sm:hover:scale-110 active:scale-95"
            >
              Explore Gallery
            </Link>
          </div>

          {/* Stats with glow effect */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4">
            <div className="group text-center p-3 sm:p-4 md:p-6 bg-red-950/20 border border-red-500/20 rounded-xl sm:rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm active:scale-95">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">30+</div>
              <div className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">Simulations</div>
            </div>
            <div className="group text-center p-3 sm:p-4 md:p-6 bg-red-950/20 border border-red-500/20 rounded-xl sm:rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm active:scale-95">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">60 FPS</div>
              <div className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">Performance</div>
            </div>
            <div className="group text-center p-3 sm:p-4 md:p-6 bg-red-950/20 border border-red-500/20 rounded-xl sm:rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm active:scale-95">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-400 to-red-600 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-gray-300 text-xs sm:text-sm font-semibold tracking-wide">Browser-Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Physicist Carousel - Infinite Scroll */}
      <div className="relative w-full py-24 overflow-hidden">
        <div className="text-center mb-16 px-4">
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-red-400 via-rose-300 to-red-500 bg-clip-text text-transparent animate-gradient">
            The Physicists Who Changed the World
          </h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Standing on the shoulders of <span className="text-red-400 font-bold">giants</span> - explore the minds behind the simulations
          </p>
        </div>

        {/* Infinite scrolling carousel */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-scroll-left hover:pause-animation">
            {/* Duplicate the array for seamless loop */}
            {[...physicists, ...physicists].map((physicist, index) => (
              <Link
                key={index}
                to={`/physicist/${physicist.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 w-96 mx-4 group block"
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="relative h-full bg-gradient-to-br from-red-950/60 via-black/80 to-red-900/50 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/50 transition-all duration-500 hover:scale-105 hover:border-red-500/60 hover:shadow-red-500/40 cursor-pointer">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10 p-8">
                    {/* Image with premium styling */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-rose-500/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative w-full h-80 rounded-2xl overflow-hidden border-4 border-red-500/50 shadow-2xl group-hover:border-red-400/80 transition-all duration-500">
                        <img 
                          src={physicist.imagePath}
                          alt={physicist.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="320"%3E%3Crect fill="%23991b1b" width="320" height="320"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" fill="%23fca5a5"%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        
                        {/* Name overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-3xl font-black text-white mb-1 drop-shadow-lg">
                            {physicist.name}
                          </h3>
                          <p className="text-red-300 text-sm font-bold">{physicist.years}</p>
                        </div>
                      </div>
                      
                      {/* Decorative corners */}
                      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Contribution */}
                    <div className="mb-4 p-4 bg-red-950/40 border-l-4 border-red-500 rounded-r-xl backdrop-blur-sm group-hover:bg-red-950/60 transition-colors duration-300">
                      <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wider">Major Contribution</p>
                      <p className="text-sm text-white font-semibold leading-relaxed">{physicist.contribution}</p>
                    </div>

                    {/* Quote */}
                    <div className="mb-4 p-4 bg-black/50 border border-red-500/20 rounded-xl backdrop-blur-sm group-hover:border-red-500/40 transition-colors duration-300">
                      <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wider">Famous Quote</p>
                      <p className="text-sm text-gray-200 italic leading-relaxed">"{physicist.quote}"</p>
                    </div>

                    {/* Simulations */}
                    <div className="p-4 bg-gradient-to-r from-red-950/50 to-rose-950/50 border border-red-500/30 rounded-xl backdrop-blur-sm group-hover:from-red-950/70 group-hover:to-rose-950/70 transition-colors duration-300">
                      <p className="text-xs text-red-300 font-bold mb-2 uppercase tracking-wider">Featured In</p>
                      <p className="text-sm text-white font-medium">{physicist.simulations}</p>
                    </div>
                  </div>

                  {/* Premium badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-xs font-black text-white shadow-lg shadow-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    LEGEND
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pause on hover hint */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 font-semibold">
            Hover over a card to pause and explore
          </p>
        </div>
      </div>

      {/* Simulations Showcase */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
            Explore Our Simulations
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From classical mechanics to chaotic systems, discover physics in <span className="text-red-400 font-semibold">stunning detail</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {simulations.map((sim, index) => (
            <Link
              key={sim.name}
              to={`/simulation-info/${sim.name.toLowerCase().replace(/\s+/g, '-')}`}
              onMouseEnter={() => setIsHovering(index)}
              onMouseLeave={() => setIsHovering(null)}
              className={`group relative p-8 bg-gradient-to-br from-red-950/30 to-black/60 backdrop-blur-sm border-2 ${
                isHovering === index ? 'border-red-500/70 scale-110' : 'border-red-500/20'
              } rounded-2xl transition-all duration-300 hover:shadow-2xl ${sim.glow} cursor-pointer block`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${sim.color} mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg ${sim.glow}`}>
                <sim.icon className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{sim.name}</h3>
              <p className="text-sm text-gray-300">{sim.description}</p>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/0 to-rose-500/0 ${
                isHovering === index ? 'from-red-500/10 to-rose-500/10' : ''
              } transition-all duration-300`}></div>
            </Link>
          ))}
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
