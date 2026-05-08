import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    items: [
      {
        productId: Number,
        title: String,
        price: Number,
        thumbnail: String,
        description: String,
        rating: Number,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    appliedPromo: {
      code: String,
      discount: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expire: 2592000, // 30 days TTL
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
