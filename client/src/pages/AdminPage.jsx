import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Package, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add');
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    price: '',
    category: 'Hoodies',
    image1: '',
    image2: '',
    newDrop: false
  });

  // Sécurité Frontend
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      toast.error("Accès refusé");
    }
  }, [user, navigate]);

  // Fonctions de chargement
  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
          if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error(err));
  };

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/orders', {
        headers: { 'x-auth-token': token }
    })
      .then(res => {
          if (!res.ok) throw new Error("Non autorisé");
          return res.json();
      })
      .then(data => {
          if (Array.isArray(data)) {
              setOrders(data);
          } else {
              setOrders([]); 
          }
      })
      .catch(err => console.error("Erreur chargement commandes:", err));
  };

  useEffect(() => {
    if (token) {
        fetchProducts();
        fetchOrders();
    }
  }, [token]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token 
        },
        body: JSON.stringify({
            ...formData,
            id: parseInt(formData.id),
            price: parseInt(formData.price),
            sizes: ['S', 'M', 'L', 'XL']
        })
      });
      if (!res.ok) throw new Error('Erreur création');
      toast.success("Produit créé !");
      fetchProducts();
      setFormData({...formData, id: '', name: '', price: '', image1: '', image2: ''});
    } catch (err) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sûr de vouloir supprimer ce produit ?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { 
          method: 'DELETE',
          headers: { 'x-auth-token': token } 
      });
      toast.success("Produit supprimé");
      fetchProducts();
    } catch (err) {
      toast.error("Erreur suppression");
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
        <span className="bg-black text-white text-xs px-2 py-1 font-bold uppercase">Mode Superviseur</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase transition-colors ${activeTab === 'add' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <Plus size={18} /> Ajouter Produit
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase transition-colors ${activeTab === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <Package size={18} /> Gérer Stocks
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            <ShoppingBag size={18} /> Commandes Clients
          </button>
        </div>

        <div className="lg:col-span-3">
            
            {activeTab === 'add' && (
                <div className="bg-gray-50 p-8 border border-gray-200">
                    <h2 className="text-xl font-black uppercase mb-6">Nouveau Produit</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" placeholder="ID Unique (ex: 5, 6...)" className="p-3 border text-sm" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required />
                            <input type="number" placeholder="Prix (€)" className="p-3 border text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <input type="text" placeholder="Nom du produit" className="w-full p-3 border text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <input type="text" placeholder="Marque" className="w-full p-3 border text-sm" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required />
                        
                        <select className="w-full p-3 border text-sm bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Hoodies">Hoodies</option>
                            <option value="Pants">Pantalons</option>
                            <option value="T-Shirts">T-Shirts</option>
                            <option value="Jackets">Vestes</option>
                        </select>

                        <input type="text" placeholder="URL Image 1 (Principale)" className="w-full p-3 border text-sm" value={formData.image1} onChange={e => setFormData({...formData, image1: e.target.value})} required />
                        <input type="text" placeholder="URL Image 2 (Hover)" className="w-full p-3 border text-sm" value={formData.image2} onChange={e => setFormData({...formData, image2: e.target.value})} />

                        <label className="flex items-center gap-2 text-sm font-bold uppercase cursor-pointer">
                            <input type="checkbox" checked={formData.newDrop} onChange={e => setFormData({...formData, newDrop: e.target.checked})} />
                            Est-ce un nouveau drop ? (Badge NEW)
                        </label>

                        <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900">
                            Mettre en ligne
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'list' && (
                <div className="bg-white border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-xs font-bold uppercase border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4">Produit</th>
                                <th className="p-4">Prix</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {products.map(p => (
                                <tr key={p._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-mono text-gray-500">#{p.id}</td>
                                    <td className="p-4 font-bold">{p.name}</td>
                                    <td className="p-4">{p.price}€</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-xs font-bold uppercase border-b">
                                <th className="p-4">N° Commande</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Articles</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {orders.map(order => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-mono text-gray-500 text-xs">
                                        ...{order._id.slice(-6)}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold">{order.userId?.username || 'Inconnu'}</div>
                                        <div className="text-xs text-gray-500">{order.userId?.email}</div>
                                    </td>
                                    <td className="p-4 text-xs">
                                        {order.items.map((item, idx) => (
                                            <div key={idx}>
                                                {item.quantity}x {item.name} ({item.size})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4 font-mono font-bold">{order.total}€</td>
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 font-bold uppercase rounded-full">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 uppercase text-xs">
                                        Aucune commande trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AdminPage;