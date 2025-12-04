import { Link } from 'react-router-dom';
import { Rocket, Zap, Globe, Lock, Sparkles, Atom, Waves, Wind, Orbit, FlaskConical, Brain, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const simulations = [
    { name: 'Solar System', icon: Orbit, color: 'from-yellow-500 to-orange-500', description: 'Planetary orbits' },
    { name: 'Wave Motion', icon: Waves, color: 'from-blue-500 to-cyan-500', description: '3D wave dynamics' },
    { name: 'Double Pendulum', icon: TrendingUp, color: 'from-purple-500 to-pink-500', description: 'Chaotic motion' },
    { name: 'Rocket Launch', icon: Rocket, color: 'from-red-500 to-orange-500', description: 'Thrust & drag' },
    { name: 'DNA Helix', icon: FlaskConical, color: 'from-green-500 to-emerald-500', description: 'Molecular structure' },
    { name: 'Fluid Dynamics', icon: Wind, color: 'from-cyan-500 to-blue-500', description: 'Particle fluids' },
    { name: 'Lorenz Attractor', icon: Brain, color: 'from-indigo-500 to-purple-500', description: 'Strange attractor' },
    { name: 'Magnetic Field', icon: Atom, color: 'from-pink-500 to-rose-500', description: 'Field lines' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="text-primary-400" size={20} />
            <span className="text-primary-300 text-sm font-medium">15+ Physics Simulations Available</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            PhysVerse
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-200 mb-6 font-light">
            Where Physics Comes Alive
          </p>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the beauty of physics through stunning 3D visualizations. Create, explore, and share 
            interactive simulations from quantum mechanics to celestial dynamics.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link 
              to="/preview" 
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 hover:scale-105"
            >
              <span className="relative z-10">Try It Now - Free!</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Link>
            
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-primary-500/30 hover:border-primary-500/50 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              Sign Up to Save
            </Link>
            
            <Link 
              to="/gallery" 
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              Explore Gallery
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">15+</div>
              <div className="text-gray-400 text-sm">Simulations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">60 FPS</div>
              <div className="text-gray-400 text-sm">Performance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-gray-400 text-sm">Browser-Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulations Showcase */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Explore Our Simulations
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From classical mechanics to chaotic systems, discover physics in stunning detail
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {simulations.map((sim, index) => (
            <div 
              key={sim.name}
              className="group relative p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${sim.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <sim.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{sim.name}</h3>
              <p className="text-sm text-gray-400">{sim.description}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-purple-500/0 group-hover:from-primary-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400">Everything you need for physics simulation</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-primary-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Rocket className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Real-time 3D</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              WebGL-powered simulations with buttery smooth 60 FPS performance
            </p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Interactive Controls</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Adjust parameters in real-time and see instant results
            </p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Globe className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Cloud Sync</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Save your work and access it from any device, anywhere
            </p>
          </div>

          <div className="group p-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Lock className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Share & Collaborate</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Share your simulations publicly or keep them private
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative p-12 md:p-16 bg-gradient-to-br from-primary-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-primary-500/30 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10"></div>
          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join PhysVerse today and unlock the power of interactive physics simulation
            </p>
            <Link 
              to="/signup" 
              className="inline-block px-10 py-5 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 rounded-xl font-semibold text-xl transition-all duration-300 shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
}
