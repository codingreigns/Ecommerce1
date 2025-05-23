const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const orderItemSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: { type: ObjectId, ref: "Product", required: true },
});

const orderSchema = new Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide tax amount"],
    },
    shippingFee: {
      type: Number,
      required: [true, "Please provide shipping fee"],
    },
    subtotal: { type: Number, required: [true, "Please provide subtotal"] },
    total: { type: Number, required: [true, "Please provide total amount"] },
    orderItems: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "paid", "delivered", "cancelled", "failed"],
      default: "pending",
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    clientSecret: { type: String, required: true },
    paymentIntentId: { type: String },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = { Order, orderSchema };
