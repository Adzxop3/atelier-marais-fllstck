import React, { useState, useRef, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null); 
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery)}`); 
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: 'Tout voir', path: '/category/all' },
    { name: 'Hoodies', path: '/category/hoodies' },
    { name: 'Pantalons', path: '/category/pants' },
    { name: 'T-Shirts', path: '/category/t-shirts' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            
            {/* 1. Mode Normal (Quand recherche fermée) */}
            <div className={`flex w-full justify-between items-center transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
              
              {/* Menu Hamburger */}
              <div className="flex items-center sm:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900">
                  <Menu size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-black tracking-tighter uppercase">
                  L'ATELIER MARAIS
                </Link>
              </div>

              {/* Liens Desktop */}
              <div className="hidden sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className="text-xs font-medium text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Icônes Droite */}
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="text-gray-900 hover:text-gray-500 transition-colors"
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
                
                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="relative text-gray-900 hover:text-gray-500 group transition-colors"
                >
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link to={user ? "/account" : "/login"} className="text-gray-900 hover:text-gray-500">
  <User size={20} strokeWidth={1.5} className={user ? "fill-black" : ""} />
</Link>
              </div>
            </div>

            {/* 2. Mode Recherche (Overlay par dessus) */}
            <div className={`absolute inset-0 flex items-center bg-white z-50 transition-all duration-300 ${isSearchOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
               <form onSubmit={handleSearchSubmit} className="w-full flex items-center gap-4">
                  <Search size={20} className="text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="RECHERCHER UN PRODUIT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold uppercase tracking-widest placeholder:text-gray-300"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    <X size={24} strokeWidth={1.5} />
                  </button>
               </form>
            </div>

          </div>
        </div>
      </nav>

      {/* Menu Mobile (Inchangé) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative bg-white w-[80%] max-w-sm h-full shadow-xl flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest text-gray-900"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;