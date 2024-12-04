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

// for local dev ---
// const MONGODB_URI = "mongodb://localhost:27017/portal"

// for deployment --- 
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// User model
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true },
  gmail: {type: String, required: true },
  password: {type: String,  required: true},
  
  // for update and all
  role: { type: String, default: 'user' },
  
  // summary, update gmail, phone number, address, country, status(active/inactive)
  info: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  country: { type: String, default: '' },
  status: { type: Boolean, default: true},  
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
          gmail:'admin@gmail.com',
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


// routes ---
// default 
app.get("/",(req, res)=>{
  res.json({data:"hello"})
})

// Register route
app.post('/register', async (req, res) => {
  const { username, gmail, password } = req.body;
  
  try {
    // checking for repeated account
    const existingUser = await User.findOne({ $or: [{ username }, { gmail }] });
    if (existingUser) {
      return res.status(400).send({ message: 'Username or Gmail already exists' });
    }
    
    // hashed the password
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ username, gmail, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try{
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid password' });
    }
  
    const token = jwt.sign({ _id: user._id, role: user.role }, 'neel_hehe');    
    res.header('auth-token', token).send({ token, role: user.role });
  }
  catch(error){
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// User routes -- getting user info
app.get('/user/info', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send({ 
    username: user.username,
    info: user.info, 
    gmail:user.gmail,
    phone:user.phone,
    address:user.address,
    country:user.country,
    status:user.status,
    role:user.role,
  });
});

app.put('/user/info', auth, async (req, res) => {
  const { info, gmail, phone, address, country, status } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
     info,
     gmail, 
     phone,
     address, 
     country, 
     status, 
    });
  res.send({ message: 'Info updated successfully' });
});

// Admin routes
app.get('/admin/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  const users = await User.find({}, '-password');
  res.send(users);
});


// Update user role or status
app.put('/admin/user/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  
  const { role, status } = req.body; // Expect both role and status in the request body
  const updateFields = {};

  if (role) updateFields.role = role;
  if (status !== undefined) updateFields.status = status; // Ensure status is updated only when provided

  try {
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!user) return res.status(404).send({ message: 'User not found' });

    res.send({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.delete('/admin/user/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Deletes the user by ID
    if (!user) return res.status(404).send({ message: 'User not found' });

    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



app.get('/admin/dashboard', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  
  const totalUsers = await User.countDocuments()-1;
  const activeUsers = await User.countDocuments({ status: true })-1;
  const inactiveUsers = await User.countDocuments({ status: false });
  const totalSignups = await User.countDocuments()-1;

  res.send({
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalSignups
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));