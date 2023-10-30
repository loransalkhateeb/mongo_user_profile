const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://loransalkhateeb:loransalkhateebyazanalkhateeb123456789@cluster0.vmsvzkk.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User model
const User = mongoose.model('users', {
  email: String,
  password: String,
  name: String
  // You can add more fields as needed (e.g., name, role, etc.)
});

app.put('/updateUser/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Data to update

  try {
    // Find the user by _id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user information
    user.email = updateData.email || user.email;
    user.name = updateData.name || user.name;

    // Update password if provided
    if (updateData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      user.password = hashedPassword;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
