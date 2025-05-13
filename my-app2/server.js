import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pkg from 'csv-writer';
const { createObjectCsvWriter } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const CSV_FILE = path.join(__dirname, 'src', 'data', 'users.csv');

// CSV writer setup
const csvWriter = createObjectCsvWriter({
  path: CSV_FILE,
  header: [
    { id: 'username', title: 'username' },
    { id: 'email', title: 'email' },
    { id: 'password', title: 'password' },
    { id: 'location', title: 'location' }
  ]
});

// Helper function to read users from CSV
async function readUsers() {
  try {
    const fileContent = await fs.readFile(CSV_FILE, 'utf-8');
    const lines = fileContent.split('\n').slice(1); // Skip header
    const users = [];
    
    for (const line of lines) {
      if (line.trim()) {
        // Handle quoted location values that might contain commas
        const match = line.match(/^([^,]+),([^,]+),([^,]+),"?(.*?)"?$/);
        if (match) {
          const [_, username, email, password, location] = match;
          users.push({ 
            username: username.trim(), 
            email: email.trim(), 
            password: password.trim(),
            location: location.trim() || 'Unknown'
          });
        }
      }
    }
    
    return users;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with headers
      await fs.writeFile(CSV_FILE, 'username,email,password,location\n');
      return [];
    }
    throw error;
  }
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, location } = req.body;
    
    // Read existing users
    const users = await readUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Add new user with default location if none provided
    const newUser = { 
      username, 
      email, 
      password: hashedPassword,
      location: location || 'Unknown Location'
    };
    users.push(newUser);
    
    // Write back to CSV
    await csvWriter.writeRecords(users);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error during signup' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Read users
    const users = await readUsers();
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Send successful response with user info (excluding password and location)
    res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
