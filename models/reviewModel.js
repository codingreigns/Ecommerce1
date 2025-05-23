const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment"],
      trim: true,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    product: {
      type: ObjectId,
      ref: "Product",
      required: [true, "Please provide a product"],
    },
  },
  { timestamps: true }
);
// This index ensures that a user can only leave one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAvgRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
  console.log(result);
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateAvgRating(this.product);
  console.log("post save hook called");
});

reviewSchema.post("remove", async function () {
  await this.constructor.calculateAvgRating(this.product);
  console.log("post remove hook called");
});

const Review = model("Review", reviewSchema);
module.exports = { Review, reviewSchema };
