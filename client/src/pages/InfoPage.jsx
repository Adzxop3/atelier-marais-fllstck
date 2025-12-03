import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const InfoPage = () => {
  const { slug } = useParams();

  const getContent = () => {
    switch (slug) {
      case 'livraisons':
        return (
          <>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Expédition</h2>
            <p className="mb-4">Toutes les commandes passées avant 13h sont expédiées le jour même. Nous expédions depuis notre entrepôt à Paris.</p>
            <ul className="list-disc pl-5 mb-8 space-y-2">
              <li><strong>Colissimo Domicile (France) :</strong> 2 à 3 jours ouvrés (8€ - Offert dès 150€).</li>
              <li><strong>DHL Express (Europe) :</strong> 24h à 48h (15€).</li>
              <li><strong>Mondial Relay :</strong> 3 à 5 jours ouvrés (5€).</li>
            </ul>

            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Retours & Échanges</h2>
            <p className="mb-4">Vous disposez d'un délai de <strong>14 jours</strong> après réception de votre commande pour nous retourner vos pièces contre remboursement ou échange.</p>
            <p className="mb-4">Les articles doivent être non portés, non lavés, avec leurs étiquettes d'origine.</p>
            <div className="bg-gray-50 p-4 border border-gray-200 text-xs font-mono">
              ADRESSE DE RETOUR :<br/>
              L'ATELIER MARAIS - LOGISTIQUE<br/>
              12 RUE DE TURENNE<br/>
              75004 PARIS, FRANCE
            </div>
          </>
        );

      case 'faq':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="font-bold uppercase mb-2">Comment suivre ma commande ?</h3>
              <p>Dès l'expédition de votre commande, vous recevrez un email contenant le numéro de suivi (Colissimo ou DHL).</p>
            </div>
            <div>
              <h3 className="font-bold uppercase mb-2">Quels moyens de paiement acceptez-vous ?</h3>
              <p>Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) via notre partenaire sécurisé Stripe.</p>
            </div>
            <div>
              <h3 className="font-bold uppercase mb-2">Les articles sont-ils unisexes ?</h3>
              <p>La majorité de nos pièces (Hoodies, T-shirts) ont une coupe "Boxy" unisexe. Nous conseillons aux femmes de prendre une taille en dessous de leur taille habituelle.</p>
            </div>
          </div>
        );

      case 'guide-tailles':
        return (
          <>
            <p className="mb-8">Nos vêtements ont une coupe contemporaine, légèrement ample (Oversize). Si vous hésitez entre deux tailles, prenez la plus petite pour un rendu plus ajusté.</p>
            
            <h3 className="text-sm font-bold uppercase mb-4">Hoodies & T-Shirts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200 mb-8">
                <thead>
                  <tr className="bg-gray-100 text-xs font-bold uppercase">
                    <th className="p-3 border border-gray-200">Taille</th>
                    <th className="p-3 border border-gray-200">Largeur Poitrine (cm)</th>
                    <th className="p-3 border border-gray-200">Longueur (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  <tr><td className="p-3 border">S</td><td className="p-3 border">54</td><td className="p-3 border">68</td></tr>
                  <tr><td className="p-3 border">M</td><td className="p-3 border">57</td><td className="p-3 border">70</td></tr>
                  <tr><td className="p-3 border">L</td><td className="p-3 border">60</td><td className="p-3 border">72</td></tr>
                  <tr><td className="p-3 border">XL</td><td className="p-3 border">63</td><td className="p-3 border">74</td></tr>
                </tbody>
              </table>
            </div>
          </>
        );

      case 'mentions-legales':
        return (
          <div className="text-xs space-y-6">
            <div>
              <h3 className="font-bold uppercase mb-1">Éditeur du site</h3>
              <p>L'ATELIER MARAIS SAS au capital de 10 000 €<br/>
              RCS Paris B 123 456 789<br/>
              Siège social : 12 Rue de Turenne, 75004 Paris, France.<br/>
              Directeur de la publication : Le Chef Dev</p>
            </div>
            <div>
              <h3 className="font-bold uppercase mb-1">Hébergement</h3>
              <p>Le site est hébergé par Vercel Inc.<br/>
              340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>
            </div>
            <div>
              <h3 className="font-bold uppercase mb-1">Propriété Intellectuelle</h3>
              <p>Tous les éléments du site (photos, textes, logo) sont la propriété exclusive de L'Atelier Marais.</p>
            </div>
          </div>
        );

      case 'confidentialite':
        return (
          <div className="space-y-4">
            <p><strong>Protection de vos données (RGPD)</strong></p>
            <p>Les informations recueillies font l’objet d’un traitement informatique destiné à la gestion de vos commandes.</p>
            <p>Conformément à la loi « informatique et libertés », vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent.</p>
            
            <h3 className="font-bold uppercase mt-6 mb-2">Cookies</h3>
            <p>Nous utilisons des cookies strictement nécessaires au fonctionnement du site (panier, connexion) et des cookies d'analyse (Stripe) pour sécuriser les paiements.</p>
          </div>
        );

      case 'cgv':
        return (
          <div className="text-xs space-y-4 text-justify">
            <p><strong>ARTICLE 1 - OBJET</strong><br/>
            Les présentes Conditions Générales de Vente déterminent les droits et obligations des parties dans le cadre de la vente en ligne de produits proposés par L'Atelier Marais.</p>
            
            <p><strong>ARTICLE 2 - PRIX</strong><br/>
            Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC). L'Atelier Marais se réserve le droit de modifier ses prix à tout moment.</p>
            
            <p><strong>ARTICLE 3 - COMMANDE</strong><br/>
            Toute commande figure dans l'historique du compte client. L'Atelier Marais se réserve le droit d'annuler toute commande d'un client avec lequel il existerait un litige.</p>
          </div>
        );

      default:
        return <p>Contenu non disponible.</p>;
    }
  };

  const getTitle = () => {
    const titles = {
      'livraisons': 'Livraisons & Retours',
      'faq': 'Questions Fréquentes',
      'guide-tailles': 'Guide des Tailles',
      'mentions-legales': 'Mentions Légales',
      'confidentialite': 'Politique de Confidentialité',
      'cgv': 'Conditions Générales de Vente'
    };
    return titles[slug] || 'Information';
  };

  return (
    <div className="min-h-[70vh] pt-32 pb-20 px-4 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Retour boutique
      </Link>

      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b border-black pb-6">
        {getTitle()}
      </h1>
      
      <div className="text-sm text-gray-700 leading-relaxed font-sans">
        {getContent()}
      </div>
    </div>
  );
};

export default InfoPage;