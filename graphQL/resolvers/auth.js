const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User with this email id does not exists");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is not correct");
    }
    const token = jwt.sign({ userId: user.id, email: email }, "secretkey", {
      expiresIn: "1h",
    }); //we can put some data in the token which we can later retrieve, we dont have tobut
    //we can, there will some default data added by this pockage and we can store our own data too,
    //first arg is the data that we want to put in the token, 2nd is the key required to hash the token
    // and later be required to validate it, only someone who know the key can validate the token

    return { userID: user.id, token, tokenExpiration: 1 };
  },
};
