import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Cart from './components/Cart';
import Hero from './components/Hero';
import FeaturedCollection from './components/FeaturedCollection';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import InfoPage from './pages/InfoPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white text-black font-sans flex flex-col">
          <Navbar />
          <Cart />
          
        
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<><Hero /><FeaturedCollection /></>} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/info/:slug" element={<InfoPage />} />
            </Routes>
          </main>

          <Footer />

          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#000',
                color: '#fff',
                borderRadius: '0px',
                border: '1px solid #333',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              },
              success: { iconTheme: { primary: '#fff', secondary: '#000' } },
              error: { 
                style: { border: '1px solid #ef4444' },
                iconTheme: { primary: '#ef4444', secondary: '#fff' } 
              },
            }}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;