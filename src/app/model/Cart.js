const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const cartSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      product: {

          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total_price: {
        type: Number,
        required: true,
      },
      quantity: {
          type: Number,
          // required: true,
      },
      quantityProduct: {
        type: Number,
        // required: true,
    },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
},{ versionKey: false , 
    timestamps: {
      currentTime: () => Math.floor(Date.now() + 7 * 60 * 60 * 1000), // Thiết lập thời gian theo UTC+7
    },
  }
);


module.exports = mongoose.model("Cart", cartSchema);

