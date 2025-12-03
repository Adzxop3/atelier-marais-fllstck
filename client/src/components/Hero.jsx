import React from 'react';
import { Link } from 'react-router-dom'; 

const Hero = () => {
  return (
    <div className="relative h-[90vh] w-full bg-gray-900 overflow-hidden">
      {/* Image de fond */}
      <img 
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop" 
        alt="Collection Printemps" 
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
      />
      
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className="text-white text-xs font-bold tracking-[0.3em] mb-4 uppercase drop-shadow-md">
          Collection Printemps / Été 2025
        </span>
        <h2 className="text-white text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase drop-shadow-lg">
          Urban <br className="md:hidden" /> Utility
        </h2>
        
        <Link 
          to="/category/all" 
          className="bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 border border-white"
        >
          Découvrir la collection
        </Link>
      </div>
    </div>
  );
};

export default Hero;