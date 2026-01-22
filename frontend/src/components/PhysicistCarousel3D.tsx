import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Physicist {
  id: number;
  name: string;
  field: string;
  description: string;
  image: string;
  achievements: string[];
  quote: string;
}

const physicists: Physicist[] = [
  {
    id: 1,
    name: "Albert Einstein",
    field: "Theoretical Physics",
    description: "Developed the theory of relativity, fundamentally changing our understanding of space, time, and gravity.",
    image: "/physicists/einstein.jpg",
    achievements: ["Theory of Relativity", "Nobel Prize 1921", "E=mc²"],
    quote: "Imagination is more important than knowledge."
  },
  {
    id: 2,
    name: "Marie Curie",
    field: "Radioactivity",
    description: "Pioneer in radioactivity research, first woman to win a Nobel Prize, and first person to win Nobel Prizes in two different sciences.",
    image: "/physicists/curie.jpg",
    achievements: ["Nobel Prize Physics 1903", "Nobel Prize Chemistry 1911", "Discovered Polonium & Radium"],
    quote: "Nothing in life is to be feared, it is only to be understood."
  },
  {
    id: 3,
    name: "Isaac Newton",
    field: "Classical Mechanics",
    description: "Formulated the laws of motion and universal gravitation, laying the groundwork for classical mechanics.",
    image: "/physicists/newton.jpg",
    achievements: ["Laws of Motion", "Universal Gravitation", "Calculus Co-inventor"],
    quote: "If I have seen further it is by standing on the shoulders of Giants."
  },
  {
    id: 4,
    name: "Nikola Tesla",
    field: "Electromagnetism",
    description: "Inventor and electrical engineer who contributed to the development of the modern alternating current electricity supply system.",
    image: "/physicists/tesla.jpg",
    achievements: ["AC Motor", "Tesla Coil", "Wireless Technology"],
    quote: "The present is theirs; the future, for which I really worked, is mine."
  },
  {
    id: 5,
    name: "Stephen Hawking",
    field: "Cosmology",
    description: "Theoretical physicist known for his work on black holes and cosmology, making complex physics accessible to the public.",
    image: "/physicists/hawking.jpg",
    achievements: ["Hawking Radiation", "Black Hole Thermodynamics", "A Brief History of Time"],
    quote: "Intelligence is the ability to adapt to change."
  },
  {
    id: 6,
    name: "Richard Feynman",
    field: "Quantum Physics",
    description: "Developed quantum electrodynamics and was known for his ability to explain complex physics concepts simply.",
    image: "/physicists/feynman.jpg",
    achievements: ["Nobel Prize Physics 1965", "Feynman Diagrams", "Quantum Electrodynamics"],
    quote: "I would rather have questions that can't be answered than answers that can't be questioned."
  }
];

export default function PhysicistCarousel3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % physicists.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextPhysicist = () => {
    setCurrentIndex((prev) => (prev + 1) % physicists.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const prevPhysicist = () => {
    setCurrentIndex((prev) => (prev - 1 + physicists.length) % physicists.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getVisiblePhysicists = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + physicists.length) % physicists.length;
      visible.push({ ...physicists[index], position: i });
    }
    return visible;
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 800],
              y: [0, Math.random() * 400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 3D Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        <div className="relative w-full h-full preserve-3d">
          <AnimatePresence mode="wait">
            {getVisiblePhysicists().map((physicist, index) => {
              const { position } = physicist;
              const isCenter = position === 0;
              const isAdjacent = Math.abs(position) === 1;
              const isVisible = Math.abs(position) <= 2;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={`${physicist.id}-${currentIndex}`}
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer ${
                    isCenter ? 'z-30' : isAdjacent ? 'z-20' : 'z-10'
                  }`}
                  initial={{
                    rotateY: position * 72,
                    translateZ: isCenter ? 0 : -200,
                    scale: isCenter ? 1 : 0.7,
                    opacity: isCenter ? 1 : 0.6,
                  }}
                  animate={{
                    rotateY: position * 72,
                    translateZ: isCenter ? 0 : -200,
                    scale: isCenter ? 1 : 0.7,
                    opacity: isCenter ? 1 : 0.6,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  onClick={() => {
                    if (!isCenter) {
                      setCurrentIndex(physicist.id - 1);
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 10000);
                    }
                  }}
                >
                  {/* Physicist Card */}
                  <div className={`relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-2xl transition-all duration-500 ${
                    isCenter ? 'w-80 h-80' : 'w-64 h-64'
                  }`}>
                    {/* Glow effect for center card */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl -z-10" />
                    )}

                    {/* Physicist Image */}
                    <div className={`relative mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30 ${
                      isCenter ? 'w-24 h-24' : 'w-16 h-16'
                    }`}>
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <span className={`font-bold text-white ${isCenter ? 'text-2xl' : 'text-lg'}`}>
                          {physicist.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>

                    {/* Physicist Info */}
                    <div className="text-center text-white">
                      <h3 className={`font-bold mb-2 ${isCenter ? 'text-xl' : 'text-lg'}`}>
                        {physicist.name}
                      </h3>
                      <p className={`text-blue-200 mb-3 ${isCenter ? 'text-sm' : 'text-xs'}`}>
                        {physicist.field}
                      </p>
                      
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-xs text-gray-300 mb-3 line-clamp-3">
                            {physicist.description}
                          </p>
                          <div className="flex flex-wrap gap-1 justify-center mb-3">
                            {physicist.achievements.slice(0, 2).map((achievement, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-500/30 rounded-full text-xs text-blue-200"
                              >
                                {achievement}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs italic text-purple-200 line-clamp-2">
                            "{physicist.quote}"
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Floating particles around center card */}
                    {isCenter && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
                            animate={{
                              x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                              y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                              scale: [1, 1.5, 1],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.5,
                            }}
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevPhysicist}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextPhysicist}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex space-x-2">
        {physicists.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-40">
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`} />
      </div>
    </div>
  );
}