const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); 
const Subscriber = require('./models/Subscriber');
require('dotenv').config();

const app = express();
const JWT_SECRET = "latelier_secret_key_123"; 

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Bloque l'IP après 5 tentatives ratées en 15 minutes
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 5, // Limite à 5 tentatives
	message: { message: "Trop de tentatives. Compte bloqué temporairement pour 15 minutes." },
	standardHeaders: true, 
	legacyHeaders: false, 
});

// Middleware Global
app.use(helmet()); 
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const auth = require('./middleware/auth'); 
const admin = require('./middleware/admin');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));


//                 ROUTES API

// --- 1. AUTHENTIFICATION SÉCURISÉE ---

// Inscription (Avec Validation Regex)
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validation Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format d'email invalide." });
    }

    // 2. Validation Mot de passe Robuste
    // Min 8 chars, 1 Majuscule, 1 Minuscule, 1 Chiffre, 1 Caractère spécial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Le mot de passe doit contenir : 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial." 
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // 3. Hashage renforcé (Salt 12)
    const hashedPassword = await bcrypt.hash(password, 12); 
    
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Connexion (Protégée par Rate Limiter)
app.post('/api/login', loginLimiter, async (req, res) => { 
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Identifiants incorrects" }); 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Identifiants incorrects" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        wishlist: user.wishlist,
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// --- 2. PRODUITS ---

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (product) res.json(product);
        else res.status(404).json({ message: "Produit introuvable" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', auth, admin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', auth, admin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: parseInt(req.params.id) });
    res.json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- 3. WISHLIST ---

app.post('/api/wishlist/toggle', auth, async (req, res) => {
  try {
    const { productId } = req.body; 
    const userId = req.user.id; 

    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ message: "Produit introuvable" });

    const user = await User.findById(userId);
    const index = user.wishlist.indexOf(product._id);
    
    if (index === -1) {
      user.wishlist.push(product._id);
      await user.save();
      res.json({ message: "Ajouté aux favoris", wishlist: user.wishlist, added: true });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: "Retiré des favoris", wishlist: user.wishlist, added: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get('/api/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist'); 
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// --- 4. PAIEMENT STRIPE ---

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body; 
    let total = 0;
    for (const item of items) {
      const product = await Product.findOne({ id: item.id });
      if (product) {
        total += product.price * item.quantity;
      }
    }

    if (total === 0) return res.status(400).send({error: "Total invalide"});

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'eur',
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    res.status(500).json({ error: error.message });
  }
});


// --- 5. COMMANDES ---

app.post('/api/orders', auth, async (req, res) => {
  try {
    const { items, total, paymentId } = req.body;
    
    const orderItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size
    }));

    const newOrder = new Order({
      userId: req.user.id,
      items: orderItems,
      total,
      paymentId
    });

    await newOrder.save();
    console.log("✅ Commande sauvegardée :", newOrder._id);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ Erreur sauvegarde commande :", error);
    res.status(500).json({ message: "Erreur création commande" });
  }
});

app.get('/api/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur récupération" });
    }
});

app.get('/api/orders', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération" });
  }
});

app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find().select('-password'); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// --- 6. NEWSLETTER ---
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Email invalide" });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Déjà inscrit !" });
    }

    const newSub = new Subscriber({ email });
    await newSub.save();

    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- LANCEMENT SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur tournant sur le port ${PORT}`));