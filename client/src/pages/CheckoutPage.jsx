import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal, clearCart } = useCart(); 
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length > 0) {
      fetch("http://localhost:5000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(err => console.error("Erreur init paiement", err));
    }
  }, [cartItems]);

  const handleSuccess = async (paymentId) => {
    // 1. Sauvegarder la commande en BDD
    try {
        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token 
          },
          body: JSON.stringify({
            items: cartItems,
            total: cartTotal,
            paymentId: paymentId
          })
        });
        
        // 2. Vider le panier (IMPORTANT)
        clearCart();

        // 3. Notifier et rediriger
        toast.success(`COMMANDE VALIDÉE (${cartTotal}€)`);
        navigate('/account');
        
      } catch (err) {
        toast.error("Paiement ok mais erreur sauvegarde commande");
        console.error(err);
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
        setProcessing(false);
        return;
    }

    const toastLoading = toast.loading('Traitement du paiement...');

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: 'Client Atelier Marais' },
      },
    });

    toast.dismiss(toastLoading);

    if (result.error) {
      // CAS SPÉCIAL : Si l'erreur dit "Déjà payé", c'est en fait un succès !
      if (result.error.payment_intent && result.error.payment_intent.status === 'succeeded') {
          await handleSuccess(result.error.payment_intent.id);
      } else {
          // Vraie erreur (carte refusée, etc.)
          toast.error(result.error.message.toUpperCase());
          setProcessing(false);
      }
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        await handleSuccess(result.paymentIntent.id);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-8 border border-gray-200">
      <h3 className="text-xl font-black uppercase mb-6">Paiement sécurisé</h3>
      
      <div className="mb-6 p-4 bg-white border border-gray-200">
        <CardElement options={{
            style: {
                base: { fontSize: '14px', color: '#000', fontFamily: 'monospace', '::placeholder': { color: '#aab7c4' } },
                invalid: { color: '#ef4444' },
            },
        }} />
      </div>
      
      <button 
        disabled={!stripe || processing || !clientSecret}
        className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
        {processing ? "TRAITEMENT..." : `PAYER ${cartTotal}€`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  if (cartItems.length === 0) return (
      <div className="min-h-screen pt-32 text-center uppercase tracking-widest text-xs font-bold text-gray-500">
          Votre panier est vide
      </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 text-center sm:text-left">
        Validation de commande
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
           <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-400 border-b pb-2">Récapitulatif</h3>
           <div className="space-y-4 mb-6">
             {cartItems.map(item => (
                <div key={item.id + item.size} className="flex justify-between text-sm items-center">
                    <div>
                        <span className="font-bold uppercase">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-2">x{item.quantity} / {item.size}</span>
                    </div>
                    <span className="font-mono font-medium">{item.price * item.quantity}€</span>
                </div>
             ))}
           </div>
           <div className="border-t border-black pt-4 flex justify-between font-black text-xl uppercase tracking-tighter">
               <span>Total</span>
               <span>{cartTotal}€</span>
           </div>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;