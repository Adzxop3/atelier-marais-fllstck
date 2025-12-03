import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'; 
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { category } = useParams(); 
  const [searchParams] = useSearchParams(); 
  const searchQuery = searchParams.get('search'); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        let filtered = data;

        if (category !== 'all') {
          filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query) 
          );
        }

        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [category, searchQuery]); 

  const getTitle = () => {
    if (searchQuery) return `Recherche : "${searchQuery}"`;
    return category === 'all' ? 'Toute la collection' : category;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center">
        {getTitle()}
      </h1>

      {loading ? (
        <div className="text-center py-20 animate-pulse font-mono text-xs">CHARGEMENT...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center">
          <p className="text-gray-500 mb-4">Aucun produit ne correspond à votre recherche.</p>
          <a href="/category/all" className="text-black underline text-xs font-bold uppercase tracking-widest">
            Voir toute la collection
          </a>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;