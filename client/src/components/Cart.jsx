import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast'; 

const Cart = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false); 

    if (user) {
      // CAS 1 : Connecté -> On va au paiement
      navigate('/checkout');
    } else {
      // CAS 2 : Pas connecté -> Message + Redirection Login
      toast.error("Veuillez vous connecter pour commander");
      navigate('/login');
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col">
        
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tighter">Votre Panier</h2>
          <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <p className="uppercase tracking-widest text-xs">Le panier est vide</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-xs underline font-bold"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                  <img src={item.image1} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase">{item.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {item.brand} — Taille {item.size}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Qté: {item.quantity}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-mono">{item.price * item.quantity}€</span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest">Total</span>
              <span className="text-lg font-mono font-bold">{cartTotal}€</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
            >
              Paiement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;