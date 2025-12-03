import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const AccountPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // États pour les données
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]); 

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Chargement des données selon l'onglet
  useEffect(() => {
    if (!token) return;

    if (activeTab === 'wishlist') {
      fetch('http://localhost:5000/api/wishlist', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => setWishlistProducts(data))
      .catch(console.error);
    }

    // Charger les commandes
    if (activeTab === 'orders') {
      fetch('http://localhost:5000/api/my-orders', {
        headers: { 'x-auth-token': token }
      })
      .then(res => res.json())
      .then(data => setMyOrders(data))
      .catch(console.error);
    }
  }, [activeTab, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12">Mon Compte</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* MENU LATERAL */}
        <div className="space-y-2">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
            <User size={18} /> Profil
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
            <Package size={18} /> Commandes
          </button>
          <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
            <Heart size={18} /> Favoris
          </button>

          {user.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-black bg-gray-100 hover:bg-gray-200 transition-colors mb-4">
                <LayoutDashboard size={18} /> Administration
            </button>
          )}
          
          <div className="pt-8 border-t border-gray-100 mt-8">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} /> Se déconnecter
            </button>
          </div>
        </div>

        {/* CONTENU CENTRAL */}
        <div className="lg:col-span-3">
          
          {/* PROFIL */}
          {activeTab === 'profile' && (
            <div className="bg-gray-50 p-8 border border-gray-100">
              <h3 className="text-xl font-black uppercase mb-6">Informations personnelles</h3>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nom d'utilisateur</label>
                  <div className="p-3 bg-white border border-gray-200 text-sm font-mono">{user.username}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <div className="p-3 bg-white border border-gray-200 text-sm font-mono">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* COMMANDES */}
          {activeTab === 'orders' && (
            <div>
                 <h3 className="text-xl font-black uppercase mb-6">Mes Commandes</h3>
                 {myOrders.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-300">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                        <p className="text-sm font-bold uppercase tracking-widest">Aucune commande pour le moment</p>
                        <button onClick={() => navigate('/category/all')} className="mt-4 text-xs underline">Commencer le shopping</button>
                    </div>
                 ) : (
                    <div className="space-y-4">
                        {myOrders.map(order => (
                            <div key={order._id} className="border border-gray-200 p-6 bg-white">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Commande</span>
                                        <p className="font-mono text-sm text-gray-500">#{order._id.slice(-6)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-black text-white text-[10px] px-2 py-1 uppercase font-bold tracking-widest rounded-sm">
                                            {order.status}
                                        </span>
                                        <p className="font-mono font-bold mt-1">{order.total}€</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name} <span className="text-gray-400">({item.size})</span></span>
                                            <span className="font-mono">{item.price}€</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
          )}

          {/* FAVORIS */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="text-xl font-black uppercase mb-6">Mes Favoris</h3>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-gray-300">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest">Votre liste est vide</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map(product => <ProductCard key={product._id} product={product} />)}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AccountPage;