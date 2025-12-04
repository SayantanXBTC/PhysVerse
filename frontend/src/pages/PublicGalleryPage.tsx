import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { simulationService } from '@/services/simulationService';
import { simulationRegistry } from '@/simulation/registry';
import { Simulation, User } from '@/types';
import { Eye, User as UserIcon, Calendar, Sparkles } from 'lucide-react';

export default function PublicGalleryPage() {
  const { data: simulations = [], isLoading } = useQuery({
    queryKey: ['public-simulations'],
    queryFn: simulationService.getPublic
  });

  const getSimulationColor = (type: string) => {
    const colors: Record<string, string> = {
      'projectile': 'from-orange-500 to-red-500',
      'spring-mass': 'from-green-500 to-emerald-500',
      'two-body-orbit': 'from-blue-500 to-indigo-500',
      'wave': 'from-cyan-500 to-blue-500',
      'pendulum': 'from-purple-500 to-pink-500',
      'solar-system': 'from-yellow-500 to-orange-500',
      'double-pendulum': 'from-purple-500 to-pink-500',
      'particle-system': 'from-pink-500 to-rose-500',
      'bouncing-balls': 'from-red-500 to-orange-500',
      'rocket': 'from-red-500 to-orange-500',
      'fluid': 'from-cyan-500 to-blue-500',
      'fractal-tree': 'from-green-500 to-emerald-500',
      'dna-helix': 'from-green-500 to-teal-500',
      'magnetic-field': 'from-pink-500 to-purple-500',
      'lorenz-attractor': 'from-indigo-500 to-purple-500',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getSimulationMetadata = (type: string) => {
    const sim = simulationRegistry.create(type);
    return sim?.metadata;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="text-primary-400" size={20} />
            <span className="text-primary-300 text-sm font-medium">Community Creations</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Public Gallery
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore amazing physics simulations shared by the community
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading simulations...</p>
          </div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-6 bg-gray-800/50 rounded-full mb-6">
              <Eye className="text-gray-500" size={48} />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Public Simulations Yet</h3>
            <p className="text-gray-400 mb-8">Be the first to share your creation!</p>
            <Link to="/dashboard" className="btn btn-primary px-8 py-3">
              Create Simulation
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {simulations.map((sim: Simulation) => {
              const author = typeof sim.userId === 'object' ? (sim.userId as User).name : 'Unknown';
              const metadata = getSimulationMetadata(sim.type);
              const colorGradient = getSimulationColor(sim.type);
              
              return (
                <div 
                  key={sim._id} 
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Gradient header */}
                  <div className={`h-32 bg-gradient-to-br ${colorGradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/90 text-sm font-medium px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/20">
                        {metadata?.category || 'Physics'}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-primary-400 transition-colors">
                      {sim.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 capitalize">
                      {metadata?.name || sim.type.replace('-', ' ')}
                    </p>

                    {metadata?.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {metadata.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pb-4 border-b border-gray-700/50">
                      <div className="flex items-center space-x-2">
                        <UserIcon size={16} />
                        <span>{author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {metadata?.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {metadata.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/simulation/${sim._id}`}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-xl font-semibold text-center transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Eye size={18} />
                        <span>View Simulation</span>
                      </div>
                    </Link>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-purple-500/0 group-hover:from-primary-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
