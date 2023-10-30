const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://loransalkhateeb:loransalkhateebyazanalkhateeb123456789@cluster0.vmsvzkk.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User model
const User = mongoose.model('users', {
  email: String,
  password: String,
  name:String
  // You can add more fields as needed (e.g., name, role, etc.)
});

const secretKey = 'your_secret_key';

// Sign-up route
app.post('/signup', async (req, res) => {
  const { email, password,name } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({ email, password: hashedPassword,name });

    // Generate a JWT for the new user
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, secretKey, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
