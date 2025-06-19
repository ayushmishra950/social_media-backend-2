const bcrypt = require('bcryptjs');
const User = require('../Models/user');
const {sendOtpMail} = require('../Utils/otp');
// const jwt = require('jsonwebtoken');
const {user_token} = require('../Utils/token');
require('dotenv').config();


const resolvers = {
  Query: {
    users: async () => await User.find(),
  },

  Mutation: {
  registerUser: async (_, { name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000);
  // sendOtpMail(email, otp);
  const now = new Date();
  const expiry = new Date(now.getTime() + 2 * 60 * 1000); // 2 min

  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    otp,
    createTime: now,
    otpExpiryTime: expiry
  });

  await user.save();

  const token = user_token(user);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    otp: user.otp,
    createTime: user.createTime,
    otpExpiryTime: user.otpExpiryTime,
    token
  };
},


    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
        
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

     
    const token =   user_token(user);


      return {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      };
    },


    changePassword: async (_, { email, oldPassword, newPassword }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new Error('Old password is incorrect');

      const hashedPassword = await bcrypt.hash(newPassword, 6);
      user.password = hashedPassword;
      await user.save();
      

      return 'Password updated successfully';
    }
  },
};

module.exports = resolvers;
