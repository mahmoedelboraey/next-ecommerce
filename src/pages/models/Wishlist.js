import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      default: null,
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
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    
  }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);