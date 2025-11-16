import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js';
import admin from 'firebase-admin';

// ✅ Utility: Create and set JWT cookie
const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ✅ Utility: Strong password validation
const isStrongPassword = (password) => {
  // Must have at least 8 characters, one uppercase, one lowercase, one number, and one special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// ✅ REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: 'Missing Details' });

  // 🔒 Strong password check
  if (!isStrongPassword(password)) {
    return res.json({
      success: false,
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: 'User Already Exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    setAuthCookie(res, user._id);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to MERN Authentication',
      text: `Welcome ${name}, your account has been created successfully!`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: 'Email and Password Required!' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Invalid Email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid Password' });

    setAuthCookie(res, user._id);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ FIREBASE GOOGLE LOGIN
export const firebaseLogin = async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ success: false, message: 'Firebase token required.' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, uid } = decodedToken;

    let user = await userModel.findOne({ email });

    if (!user) {
      const placeholderPassword = await bcrypt.hash(uid, 10);

      user = new userModel({
        name,
        email,
        password: placeholderPassword,
        isAccountVerified: true,
        firebaseId: uid,
      });
      await user.save();
    }

    setAuthCookie(res, user._id);
    return res.json({ success: true, message: 'Logged in with Google successfully' });
  } catch (error) {
    console.error("Firebase verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid token or server error.',
    });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return res.json({ success: true, message: 'Logged Out Successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ SEND VERIFY OTP
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified)
      return res.json({ success: false, message: 'Account already verified' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Email Verification OTP',
      html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email),
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: 'Verification OTP sent to Email' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp)
    return res.json({ success: false, message: 'Missing Details' });

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User Not Found' });

    if (user.verifyOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' });
    if (user.verifyOtpExpiresAt < Date.now())
      return res.json({ success: false, message: 'OTP Expired' });

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpiresAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Account Verified Successfully!' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ CHECK AUTH STATUS
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, isAuthenticated: true });
  } catch (error) {
    return res.json({ success: false, message: error.message, isAuthenticated: false });
  }
};

// ✅ SEND PASSWORD RESET OTP
export const sendRestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User Not Found' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email),
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: 'OTP sent to your Email' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: 'Missing details' });

  // 🔒 Strong password check for reset as well
  if (!isStrongPassword(newPassword)) {
    return res.json({
      success: false,
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User Not Found' });

    if (user.resetOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' });
    if (user.resetOtpExpiresAt < Date.now())
      return res.json({ success: false, message: 'OTP Expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpiresAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password Reset Successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
