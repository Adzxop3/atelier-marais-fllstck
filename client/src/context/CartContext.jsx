import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Ajouter au panier
  const addToCart = (product, size) => {
    setCartItems(prev => {
      // On vérifie si l'article existe déjà (même ID et même taille)
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      
      if (existingItem) {
        // Si oui, on augmente la quantité
        return prev.map(item => 
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Sinon, on l'ajoute comme nouveau
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true); // Ouvre le panier automatiquement pour montrer l'ajout
  };

  // 2. Retirer du panier
  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  // 3. Vider le panier 
  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Calcul du prix total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // 5. Nombre total d'articles 
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,     
      isCartOpen, 
      setIsCartOpen,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};