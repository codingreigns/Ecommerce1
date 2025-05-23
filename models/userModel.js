const { Schema, model } = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: [true, "name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: {
      validator: isEmail,
      message: "please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
  },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

// mongoose hooks
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// instance methods
userSchema.methods.compareHashedPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = model("User", userSchema);

module.exports = { User, userSchema };
