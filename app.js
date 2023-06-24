const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://rp7007:Rp654321@cluster0.hqkq9fe.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const User = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Display the signup form

app.get('/', (req, res) => {
  res.render('signup');
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { email, name, password, educationLevel, city, countryCode, mobileNumber } = req.body;

  // Check if the user already exists in the database
  User.findOne({ email })
    .then(async (existingUser) => {
      if (existingUser) {
        // User already exists
        res.send('User already registered.');
      } else {

        try {
          // Generate a salt to use for hashing
          const salt = await bcrypt.genSalt(10);
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, salt);

          // Create a new user
          const user = new User({
            email,
            name,
            password: hashedPassword,
            educationLevel,
            city,
            countryCode,
            mobileNumber
          });

          // Save the user to the database
          const savedUser = await user.save();
          console.log('User saved:', savedUser);
          res.send('Signup Successful');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error saving user to database');
        }


      }
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      res.send('Registration failed.');
    });
});

app.get('/', (req, res) => {
  res.render('login');
});

// Display login form

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user is not found
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is not valid
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    // Authentication successful
    res.send('Login successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



