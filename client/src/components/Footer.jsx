import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    if (!email) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("INSCRIPTION VALIDÉE");
        setEmail('');
      } else {
        toast.error(data.message.toUpperCase());
      }
    } catch (err) {
      toast.error("ERREUR SERVEUR");
    }
  };

  return (
    <footer className="bg-black text-white border-t border-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Colonne 1 : Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tighter">L'Atelier Marais</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Vêtements urbains essentiels. Conçus à Paris, portés partout.
            </p>
          </div>

          {/* Colonne 2 : Aide (Liens dynamiques) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Aide & Info</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li><Link to="/info/livraisons" className="hover:text-white transition-colors">Livraisons & Retours</Link></li>
              <li><Link to="/info/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/info/guide-tailles" className="hover:text-white transition-colors">Guide des tailles</Link></li>
              <li><a href="mailto:contact@latelier.com" className="hover:text-white transition-colors">Nous contacter</a></li>
            </ul>
          </div>

          {/* Colonne 3 : Légal (Liens dynamiques) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Légal</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li><Link to="/info/cgv" className="hover:text-white transition-colors">Conditions Générales</Link></li>
              <li><Link to="/info/confidentialite" className="hover:text-white transition-colors">Politique de Confidentialité</Link></li>
              <li><Link to="/info/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Newsletter (Fonctionnelle) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-gray-400 text-xs mb-4">
              Inscrivez-vous pour recevoir nos dernières nouvelles.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="VOTRE EMAIL" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-none text-white text-xs p-3 w-full focus:ring-1 focus:ring-white outline-none"
              />
              <button 
                onClick={handleSubscribe}
                className="bg-white text-black text-xs font-bold px-4 py-3 uppercase hover:bg-gray-200 transition-colors"
              >
                OK
              </button>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">
            © 2025 L'Atelier Marais — Paris
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;