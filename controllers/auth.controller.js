const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidator } = require("../validations/auth");
const { hashPassword } = require("../utils/hashPassword.util");

exports.register = async (req, res, next) => {
  const { error } = registerValidator(req.body);

  if (error) {
    const err = new Error("Validation failed");
    err.status = 422;
    throw err;
  }

  const checkEmailExist = await User.findOne({ email: req.body.email });

  if (checkEmailExist)
    return res.status(422).json({
      message: "Email is existed",
    });

  const hashedPassword = await hashPassword(req.body.password);
  const user = new User({
    ...req.body,
    password: hashedPassword,
    role: "user",
  });

  try {
    const result = await user.save();
    res.status(201).json({
      message: "User created successfully",
      userId: result._id,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  let loadedUser;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new Error("Email or password is not correct");
    error.status = 401;
    throw error;
  }
  loadedUser = user;
  const isEqual = await bcrypt.compare(req.body.password, user.password);
  if (!isEqual) {
    const error = new Error("Email or password is not correct");
    error.status = 401;
    throw error;
  }

  try {
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        role: loadedUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ accessToken: token, userId: loadedUser._id.toString() });
    return;
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
    return err;
  }
};
