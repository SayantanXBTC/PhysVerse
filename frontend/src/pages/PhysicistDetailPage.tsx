import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, Atom, Calendar, Award, Quote, Sparkles } from 'lucide-react';

interface Physicist {
  id: string;
  name: string;
  years: string;
  contribution: string;
  imagePath: string;
  simulations: string;
  quote: string;
  biography: string;
  majorWorks: string[];
  discoveries: string[];
  timeline: { year: string; event: string }[];
  funFacts: string[];
}

const physicistsData: Record<string, Physicist> = {
  'isaac-newton': {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    years: '1643-1727',
    contribution: 'Laws of Motion & Universal Gravitation',
    imagePath: '/physicists/newton.jpg',
    simulations: 'Projectile Motion, Two-Body Orbit',
    quote: 'If I have seen further, it is by standing on the shoulders of giants.',
    biography: 'Sir Isaac Newton was an English mathematician, physicist, astronomer, and author who is widely recognized as one of the most influential scientists of all time. His work laid the foundation for classical mechanics and revolutionized our understanding of the physical world.',
    majorWorks: [
      'Philosophiæ Naturalis Principia Mathematica (1687)',
      'Opticks (1704)',
      'Method of Fluxions (Calculus)',
    ],
    discoveries: [
      'Three Laws of Motion',
      'Universal Law of Gravitation',
      'Calculus (independently with Leibniz)',
      'White light composition',
      'Reflecting telescope',
    ],
    timeline: [
      { year: '1643', event: 'Born in Woolsthorpe, England' },
      { year: '1665-1666', event: 'Annus Mirabilis - Developed calculus, optics, and gravitation' },
      { year: '1687', event: 'Published Principia Mathematica' },
      { year: '1705', event: 'Knighted by Queen Anne' },
      { year: '1727', event: 'Died in London' },
    ],
    funFacts: [
      'The apple story is likely true - he did observe falling apples',
      'He was also an alchemist and theologian',
      'Served as Warden of the Royal Mint',
      'Never married and had few close friends',
    ],
  },
  'galileo-galilei': {
    id: 'galileo-galilei',
    name: 'Galileo Galilei',
    years: '1564-1642',
    contribution: 'Kinematics & Pendulum Motion',
    imagePath: '/physicists/galileo.jpg',
    simulations: 'Pendulum, Projectile Motion',
    quote: 'All truths are easy to understand once they are discovered.',
    biography: 'Galileo Galilei was an Italian astronomer, physicist and engineer, often described as the "father of observational astronomy", "father of modern physics", and "father of the scientific method". His contributions to observational astronomy include telescopic confirmation of the phases of Venus.',
    majorWorks: [
      'Sidereus Nuncius (1610)',
      'Dialogue Concerning the Two Chief World Systems (1632)',
      'Two New Sciences (1638)',
    ],
    discoveries: [
      'Moons of Jupiter',
      'Phases of Venus',
      'Law of falling bodies',
      'Improved telescope design',
      'Sunspots',
    ],
    timeline: [
      { year: '1564', event: 'Born in Pisa, Italy' },
      { year: '1609', event: 'Built his first telescope' },
      { year: '1610', event: 'Discovered Jupiter\'s moons' },
      { year: '1633', event: 'Tried by the Inquisition' },
      { year: '1642', event: 'Died under house arrest' },
    ],
    funFacts: [
      'Had three children out of wedlock',
      'Was nearly blind in his final years',
      'The Catholic Church didn\'t pardon him until 1992',
      'His middle finger is preserved in a museum in Florence',
    ],
  },
  'robert-hooke': {
    id: 'robert-hooke',
    name: 'Robert Hooke',
    years: '1635-1703',
    contribution: "Hooke's Law of Elasticity",
    imagePath: '/physicists/hooke.jpg',
    simulations: 'Spring-Mass System',
    quote: 'The truth is, the science of Nature has been already too long made only a work of the brain.',
    biography: 'Robert Hooke was an English polymath who played an important role in the Scientific Revolution through both experimental and theoretical work. His law of elasticity, known as Hooke\'s Law, is fundamental to the study of materials and structures.',
    majorWorks: [
      'Micrographia (1665)',
      'Lectures on Light (1680)',
      'Discourse of Earthquakes (1668)',
    ],
    discoveries: [
      'Hooke\'s Law of Elasticity',
      'Coined the term "cell" in biology',
      'Wave theory of light',
      'Inverse square law of gravitation',
      'Universal joint',
    ],
    timeline: [
      { year: '1635', event: 'Born on Isle of Wight, England' },
      { year: '1662', event: 'Appointed Curator of Experiments at Royal Society' },
      { year: '1665', event: 'Published Micrographia' },
      { year: '1678', event: 'Formulated Hooke\'s Law' },
      { year: '1703', event: 'Died in London' },
    ],
    funFacts: [
      'Had a famous rivalry with Isaac Newton',
      'Was also an architect and helped rebuild London after the Great Fire',
      'No authenticated portraits of him survive',
      'Invented the anchor escapement for clocks',
    ],
  },
  'johannes-kepler': {
    id: 'johannes-kepler',
    name: 'Johannes Kepler',
    years: '1571-1630',
    contribution: 'Laws of Planetary Motion',
    imagePath: '/physicists/kepler.jpg',
    simulations: 'Solar System, Orbital Mechanics',
    quote: 'Nature uses as little as possible of anything.',
    biography: 'Johannes Kepler was a German astronomer, mathematician, and astrologer who is best known for his laws of planetary motion. His work provided the foundation for Isaac Newton\'s theory of universal gravitation.',
    majorWorks: [
      'Astronomia Nova (1609)',
      'Harmonices Mundi (1619)',
      'Epitome Astronomiae Copernicanae (1618-1621)',
    ],
    discoveries: [
      'Three Laws of Planetary Motion',
      'Elliptical orbits of planets',
      'Kepler\'s Supernova',
      'Principles of optics',
      'Logarithms in astronomy',
    ],
    timeline: [
      { year: '1571', event: 'Born in Weil der Stadt, Germany' },
      { year: '1600', event: 'Became assistant to Tycho Brahe' },
      { year: '1609', event: 'Published first two laws of planetary motion' },
      { year: '1619', event: 'Published third law of planetary motion' },
      { year: '1630', event: 'Died in Regensburg, Germany' },
    ],
    funFacts: [
      'His mother was tried for witchcraft',
      'He wrote one of the first works of science fiction',
      'Nearly became a Lutheran minister',
      'Suffered from poor health and vision problems',
    ],
  },
  'albert-einstein': {
    id: 'albert-einstein',
    name: 'Albert Einstein',
    years: '1879-1955',
    contribution: 'Theory of Relativity',
    imagePath: '/physicists/einstein.jpg',
    simulations: 'Relativistic Particles, Black Holes',
    quote: 'Imagination is more important than knowledge.',
    biography: 'Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His work is also known for its influence on the philosophy of science and his mass-energy equivalence formula E = mc².',
    majorWorks: [
      'Special Theory of Relativity (1905)',
      'General Theory of Relativity (1915)',
      'Photoelectric Effect paper (1905)',
      'Brownian Motion paper (1905)',
    ],
    discoveries: [
      'Theory of Special Relativity',
      'Theory of General Relativity',
      'Mass-energy equivalence (E=mc²)',
      'Photoelectric effect',
      'Brownian motion explanation',
    ],
    timeline: [
      { year: '1879', event: 'Born in Ulm, Germany' },
      { year: '1905', event: 'Annus Mirabilis - Published 4 groundbreaking papers' },
      { year: '1915', event: 'Completed General Theory of Relativity' },
      { year: '1921', event: 'Awarded Nobel Prize in Physics' },
      { year: '1955', event: 'Died in Princeton, New Jersey' },
    ],
    funFacts: [
      'Failed his first entrance exam to ETH Zurich',
      'Worked as a patent clerk while developing relativity',
      'Was offered the presidency of Israel in 1952',
      'His brain was preserved after death for study',
    ],
  },
  'erwin-schrodinger': {
    id: 'erwin-schrodinger',
    name: 'Erwin Schrödinger',
    years: '1887-1961',
    contribution: 'Quantum Mechanics',
    imagePath: '/physicists/schrodinger.jpg',
    simulations: 'Quantum Tunneling, Wave Functions',
    quote: 'The task is not to see what has never been seen before, but to think what has never been thought before.',
    biography: 'Erwin Schrödinger was an Austrian physicist who developed a number of fundamental results in quantum theory. He is best known for the Schrödinger equation, which describes how the quantum state of a physical system changes over time.',
    majorWorks: [
      'Schrödinger Equation (1926)',
      'What is Life? (1944)',
      'Wave Mechanics papers (1926)',
    ],
    discoveries: [
      'Schrödinger Equation',
      'Wave mechanics formulation of quantum mechanics',
      'Schrödinger\'s cat thought experiment',
      'Quantum entanglement (with Einstein)',
    ],
    timeline: [
      { year: '1887', event: 'Born in Vienna, Austria' },
      { year: '1926', event: 'Published Schrödinger Equation' },
      { year: '1933', event: 'Awarded Nobel Prize in Physics' },
      { year: '1935', event: 'Proposed Schrödinger\'s cat paradox' },
      { year: '1961', event: 'Died in Vienna' },
    ],
    funFacts: [
      'Had unconventional personal relationships',
      'Wrote extensively on philosophy and biology',
      'Fled Nazi Germany in 1933',
      'The cat thought experiment was meant to show absurdity of quantum mechanics',
    ],
  },
  'james-clerk-maxwell': {
    id: 'james-clerk-maxwell',
    name: 'James Clerk Maxwell',
    years: '1831-1879',
    contribution: 'Electromagnetic Theory',
    imagePath: '/physicists/maxwell.jpg',
    simulations: 'Electromagnetic Waves, Magnetic Fields',
    quote: 'The true logic of this world is in the calculus of probabilities.',
    biography: 'James Clerk Maxwell was a Scottish scientist in the field of mathematical physics. His most notable achievement was formulating classical electromagnetic theory, uniting electricity, magnetism, and light as manifestations of the same phenomenon.',
    majorWorks: [
      'A Treatise on Electricity and Magnetism (1873)',
      'Maxwell\'s Equations (1861-1862)',
      'Theory of Color Vision',
    ],
    discoveries: [
      'Maxwell\'s Equations',
      'Electromagnetic radiation theory',
      'Color photography',
      'Kinetic theory of gases',
      'Saturn\'s rings composition',
    ],
    timeline: [
      { year: '1831', event: 'Born in Edinburgh, Scotland' },
      { year: '1861', event: 'Created first color photograph' },
      { year: '1865', event: 'Published electromagnetic theory' },
      { year: '1871', event: 'Became first Cavendish Professor' },
      { year: '1879', event: 'Died in Cambridge, England' },
    ],
    funFacts: [
      'Published his first scientific paper at age 14',
      'Einstein kept a picture of him on his wall',
      'Died of the same cancer that killed his mother at the same age',
      'His equations predicted radio waves before they were discovered',
    ],
  },
};

export default function PhysicistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const physicist = id ? physicistsData[id] : null;

  if (!physicist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Physicist Not Found</h1>
          <Link to="/" className="text-red-400 hover:text-red-300">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-red-500/20 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-rose-500/40 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-red-500/50 shadow-2xl">
              <img
                src={physicist.imagePath}
                alt={physicist.name}
                className="w-full h-[600px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23991b1b" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="24" fill="%23fca5a5"%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                {physicist.name}
              </h1>
              <p className="text-2xl text-red-300 font-bold mb-2">{physicist.years}</p>
              <p className="text-xl text-gray-300">{physicist.contribution}</p>
            </div>

            {/* Quote */}
            <div className="p-6 bg-gradient-to-br from-red-950/40 to-black/60 border-l-4 border-red-500 rounded-r-2xl backdrop-blur-sm">
              <Quote className="text-red-400 mb-3" size={32} />
              <p className="text-lg text-gray-200 italic leading-relaxed">"{physicist.quote}"</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <Atom className="text-red-400 mb-2" size={24} />
                <p className="text-sm text-gray-400">Featured In</p>
                <p className="text-white font-semibold">{physicist.simulations}</p>
              </div>
              <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <Award className="text-red-400 mb-2" size={24} />
                <p className="text-sm text-gray-400">Major Works</p>
                <p className="text-white font-semibold">{physicist.majorWorks.length} Publications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="mb-12 p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-red-400" size={28} />
            <h2 className="text-3xl font-bold">Biography</h2>
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">{physicist.biography}</p>
        </div>

        {/* Timeline */}
        <div className="mb-12 p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-red-400" size={28} />
            <h2 className="text-3xl font-bold">Timeline</h2>
          </div>
          <div className="space-y-4">
            {physicist.timeline.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-red-400 font-bold text-lg">{item.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full mt-1.5 shadow-lg shadow-red-500/50"></div>
                <div className="flex-1 pb-4 border-l-2 border-red-500/30 pl-6 -ml-2">
                  <p className="text-gray-300">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Major Works */}
          <div className="p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-red-400" size={28} />
              <h2 className="text-3xl font-bold">Major Works</h2>
            </div>
            <ul className="space-y-3">
              {physicist.majorWorks.map((work, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">•</span>
                  <span className="text-gray-300">{work}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Discoveries */}
          <div className="p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="text-red-400" size={28} />
              <h2 className="text-3xl font-bold">Key Discoveries</h2>
            </div>
            <ul className="space-y-3">
              {physicist.discoveries.map((discovery, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">•</span>
                  <span className="text-gray-300">{discovery}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="p-8 bg-gradient-to-br from-red-950/20 to-black/40 border border-red-500/20 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-red-400" size={28} />
            <h2 className="text-3xl font-bold">Fun Facts</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {physicist.funFacts.map((fact, index) => (
              <div key={index} className="p-4 bg-red-950/30 border border-red-500/20 rounded-xl">
                <p className="text-gray-300">{fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/preview"
            className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-red-500/50 hover:scale-105"
          >
            Explore {physicist.name}'s Simulations
          </Link>
        </div>
      </div>
    </div>
  );
}
