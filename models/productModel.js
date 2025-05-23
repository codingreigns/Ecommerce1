const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
      minlength: [3, "Product name must be at least 3 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: [0, "Price must be a positive number"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
      trim: true,
      maxlength: [1000, "Product name cannot exceed 100 characters"],
      minlength: [3, "Product name must be at least 3 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please add a product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please add a product company"],
      trim: true,
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      required: [true, "Please add product colors"],
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "Please add product inventory"],
      min: [1, "Inventory must be a positive number"],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: [true, "Please add a user"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});
// mongoose hooks
productSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});

const Product = model("Product", productSchema);

module.exports = { Product, productSchema };
