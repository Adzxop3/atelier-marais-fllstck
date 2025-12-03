import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext'; 

const ProductCard = ({ product }) => {
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  // Vérifier au chargement si ce produit est déjà liké par l'utilisateur
  useEffect(() => {
    if (user && user.wishlist && user.wishlist.includes(product._id)) {
    }
  }, [user, product]);

  const toggleWishlist = async (e) => {
    e.preventDefault(); 
    
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

  return (
    <div className="relative group">
       <button 
         onClick={toggleWishlist}
         className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
       >
         <Heart 
           size={18} 
           className={isLiked ? "fill-red-500 text-red-500" : "text-black"} 
         />
       </button>

       {/* Le lien vers le produit */}
       <Link to={`/product/${product.id}`} className="block cursor-pointer flex flex-col gap-3">
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
            <img src={product.image1} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
            <img src={product.image2} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            {product.newDrop && (
              <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-gray-100">
                New
              </span>
            )}
          </div>

          <div className="flex justify-between items-start px-1">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight group-hover:underline decoration-1 underline-offset-4">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono uppercase">
                {product.brand}
              </p>
            </div>
            <span className="text-sm font-medium font-mono">
              {product.price}€
            </span>
          </div>
       </Link>
    </div>
  );
};

export default ProductCard;