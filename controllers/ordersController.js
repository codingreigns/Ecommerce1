const { Order } = require("../models/orderModel");
const { Product } = require("../models/productModel");
const { checkAuthorization } = require("../utils/jwt");
const { validateCreateOrder, validateUpdateOrder } = require("../validation");

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const {
    error,
    value: { orderItems: cartItems, tax, shippingFee },
  } = validateCreateOrder(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  let items = [];
  let subtotal = 0;

  for (let item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct)
      return res
        .status(404)
        .json({ error: `No product with id ${item.product}` });
    const { name, image, price, _id } = dbProduct;
    const singleOrder = {
      name,
      image,
      price,
      amount: item.amount,
      product: _id,
    };
    // add order to items
    items = [...items, singleOrder];
    // calculate subtotal
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeApi({ amount: total, currency: "usd" });
  const order = await Order.create({
    orderItems: items,
    tax,
    shippingFee,
    subtotal,
    total,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  return res.status(201).json({ order, clientSecret: order.clientSecret });
};
const readAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email");
  return res.status(200).json({ orders, count: orders.length });
};
const readOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId }).populate(
    "user",
    "name email"
  );
  if (!order) {
    return res.status(404).json({ msg: `No order with id ${orderId}` });
  }
  const isTheSameUser = checkAuthorization(req, order.user);
  if (!isTheSameUser)
    return res
      .status(403)
      .json({ msg: "you cannot view this order, please create your own" });
  return res.status(200).json({ order });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId }).populate(
    "user",
    "name email"
  );
  if (!order) {
    return res.status(404).json({ msg: `No order with id ${orderId}` });
  }
  const isTheSameUser = checkAuthorization(req, order.user);
  if (!isTheSameUser)
    return res
      .status(403)
      .json({ msg: "you cannot update this order, please create your own" });
  const {
    error,
    value: { paymentIntentId },
  } = validateUpdateOrder(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  return res.status(200).json({ order });
};
const deleteOrder = async (req, res) => {
  return res.send("deleteOrder");
};

const readCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  return res.json({ orders, count: orders.length });
};

module.exports = {
  createOrder,
  readAllOrders,
  readOrder,
  updateOrder,
  deleteOrder,
  readCurrentUserOrders,
};
