import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Heart } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, token } = useAuth(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        if (user && user.wishlist && user.wishlist.includes(data._id)) {
          setIsLiked(true);
        }
      })
      .catch(err => console.error(err));
  }, [id, user]); 

  const toggleWishlist = async () => {
    if (!user) {
      alert("Connectez-vous pour ajouter aux favoris !");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/wishlist/toggle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ productId: product.id })
      });
      
      if (res.ok) {
        setIsLiked(!isLiked); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-40 font-mono text-xs animate-pulse">CHARGEMENT...</div>;
  if (!product) return <div className="text-center py-40">Produit introuvable</div>;

  const images = [product.image1, product.image2].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* COLONNE À GAUCHE */}
        <div className="relative group">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
            <img 
              src={images[currentImageIndex]} 
              alt={`${product.name} vue ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-500" 
            />
          </div>

          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
              >
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
              >
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 pt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-black scale-125' 
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>


        {/* --- COLONNE À DROITE : Infos --- */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {product.brand}
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight mt-2 mb-4">
              {product.name}
            </h1>
            <p className="text-xl font-mono">
              {product.price}€
            </p>
          </div>

          <div className="mb-8 text-sm leading-relaxed text-gray-600">
            <p>
              Coupe boxy et matière premium pour ce {product.name.toLowerCase()}. 
              Confectionné dans nos ateliers avec un souci du détail constant.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest">Taille</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-bold border transition-all duration-200
                    ${selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-200 hover:border-black text-gray-900'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ZONE D'ACTION : BOUTON AJOUT + COEUR */}
          <div className="flex gap-4">
            <button 
                onClick={() => {
                if (!selectedSize) toast.error('Sélectionnez une taille');
                else addToCart(product, selectedSize);
                }}
                className="flex-1 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
                Ajouter au panier
            </button>

            <button 
                onClick={toggleWishlist}
                className="w-14 flex items-center justify-center border border-gray-200 hover:border-black transition-colors"
                title="Ajouter aux favoris"
            >
                <Heart 
                    size={20} 
                    className={isLiked ? "fill-red-500 text-red-500" : "text-black"} 
                    strokeWidth={1.5}
                />
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-xs text-green-700 font-medium">
            <Check size={14} />
            <span>En stock - Expédition sous 24h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;