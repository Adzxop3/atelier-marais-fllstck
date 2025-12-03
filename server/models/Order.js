const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Number, required: true },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    size: { type: String }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Payé' }, // Payé, Expédié, Livré
  paymentId: { type: String } // L'ID Stripe
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);