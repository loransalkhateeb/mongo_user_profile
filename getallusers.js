const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://loransalkhateeb:loransalkhateebyazanalkhateeb123456789@cluster0.vmsvzkk.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User model
const User = mongoose.model('users', {
  email: String,
  password: String,
  name: String
  // You can add more fields as needed (e.g., name, role, etc.)
});

app.get('/getUser/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by _id (MongoDB's default user ID field)
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
