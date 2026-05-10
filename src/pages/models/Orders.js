import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId:   { type: Number, required: true },
  title:       { type: String, required: true },
  price:       { type: Number, required: true },
  thumbnail:   { type: String, default: "" },
  quantity:    { type: Number, required: true, min: 1 },
});

const OrderSchema = new mongoose.Schema(
  {
  
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    items: [orderItemSchema],

    shippingInfo: {
      firstName: String,
      lastName:  String,
      email:     String,
      phone:     String,
      address:   String,
      city:      String,
      state:     String,
      zipCode:   String,
    },

    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "cash", "wallet"],
      required: true,
    },

    subtotal:    { type: Number, required: true },
    tax:         { type: Number, required: true },
    discount:    { type: Number, default: 0 },
    total:       { type: Number, required: true },

    promoCode:   { type: String, default: null },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

