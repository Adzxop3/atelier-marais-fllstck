const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    id: 1,
    name: "Hoodie Heavyweight",
    brand: "L'Atelier",
    description: "Un hoodie épais et confortable.",
    price: 140,
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    image1: "https://img01.ztat.net/article/spp-media-p1/16db55f4b45d461bba817cf4869e3e7e/b99f01029d1041de85582aba51a97402.jpg?imwidth=1800",
    image2: "https://img01.ztat.net/article/spp-media-p1/97b545af109d4d3f9f44a7cecf61eddf/a053e75257ba46a3b27ddadc79e8d1d3.jpg?imwidth=1800",
    isNew: true
  },
  {
    id: 2,
    name: "Pantalon Cargo Tech",
    brand: "Carhartt WIP",
    description: "Pantalon utilitaire multipoches.",
    price: 110,
    category: "Pants",
    sizes: ["S", "M", "L", "XL"],
    image1: "https://cdn.media.amplience.net/i/carhartt_wip/I032467_89_02-OF-01?%24OF%24=&fmt=auto&w=1080&qlt=default",
    image2: "https://cdn.media.amplience.net/i/carhartt_wip/I032467_89_02-OF-02?%24OF%24=&fmt=auto&w=1080&qlt=default",
    isNew: false
  },
  {
    id: 3,
    name: "T-Shirt Oversize",
    brand: "Arte Antwerp",
    description: "Coton lourd, coupe large.",
    price: 65,
    category: "T-Shirts",
    sizes: ["S", "M", "L"],
    image1: "https://arte-antwerp.com/cdn/shop/files/AW25-208TBLACK2.jpg?v=1753879624",
    image2: "https://arte-antwerp.com/cdn/shop/files/AW25-208TBLACK3.jpg?v=1753879637",
    isNew: true
  },
  {
    id: 4,
    name: "Veste Worker",
    brand: "L'Atelier",
    description: "Inspirée du vestiaire ouvrier.",
    price: 220,
    category: "Jackets",
    sizes: ["M", "L", "XL"],
    image1: "https://www.hastparis.com/cdn/shop/files/VDT-H25-VELASQUEZ03_0157.jpg?v=1756303462&width=990",
    image2: "https://www.hastparis.com/cdn/shop/files/VDT-H25-VELASQUEZ03_0168.jpg?v=1756303462&width=990",
    isNew: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecté à MongoDB...");
    await Product.deleteMany({});
    console.log("Anciens produits supprimés.");
    await Product.insertMany(products);
    console.log("✅ Produits ajoutés avec succès !");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();