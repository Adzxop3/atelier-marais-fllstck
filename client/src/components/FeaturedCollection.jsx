import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs animate-pulse">
        CHARGEMENT DE LA COLLECTION...
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          Derniers Drops
        </h2>
        <a href="#" className="hidden sm:block text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
          Voir tout
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;