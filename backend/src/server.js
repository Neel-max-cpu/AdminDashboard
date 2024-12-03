// import express from 'express';
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import cors from 'cors';

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portal', { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'user' },
  info: { type: String, default: '' }
});

const User = mongoose.model('User', UserSchema);

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, 'neel_hehe');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};


// Function to create default admin user
async function createDefaultAdmin() {
    try {
      const adminExists = await User.findOne({ username: 'admin' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin', 8);
        const adminUser = new User({
          username: 'admin',
          password: hashedPassword,
          role: 'admin'
        });
        await adminUser.save();
        console.log('Default admin user created');
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
}

// Call the function to create default admin
createDefaultAdmin();

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('User not found');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ _id: user._id, role: user.role }, 'neel_hehe');
  res.header('auth-token', token).send({ token, role: user.role });
});

// User routes
app.get('/user/info', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send({ info: user.info });
});

app.put('/user/info', auth, async (req, res) => {
  const { info } = req.body;
  await User.findByIdAndUpdate(req.user._id, { info });
  res.send({ message: 'Info updated successfully' });
});

// Admin routes
app.get('/admin/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  const users = await User.find({}, '-password');
  res.send(users);
});

app.put('/admin/user/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.send({ message: 'User role updated successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));