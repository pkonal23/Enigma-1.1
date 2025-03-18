require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Use port from .env

// Middleware
app.use(cors({
    origin: "*", // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    credentials: true // Allow cookies and credentials
}));
app.use(express.json());

// MongoDB connection
const dbPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB '))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema and model for the winner
const winnerSchema = new mongoose.Schema({
    name: String,
    score: Number
});

// Specify the collection name as 'userScore'
const Winner = mongoose.model('Winner', winnerSchema, 'userScore');

// Route to save winner data
app.post('/saveWinner', async (req, res) => {
    const { name, score } = req.body;

    if (!name || !score) {
        return res.status(400).send('Name and score are required');
    }

    try {
        const winner = new Winner({ name, score });
        await winner.save();
        res.status(201).send('Winner data saved successfully');
    } catch (error) {
        console.error('Error saving winner data:', error);
        res.status(500).send('Error saving winner data');
    }
});

// Route to fetch high scores
app.get('/winners', async (req, res) => {
    try {
        const winners = await Winner.find().sort({ score: -1 });
        res.status(200).json(winners);
    } catch (error) {
        console.error('Error fetching winners:', error);
        res.status(500).send('Error fetching winners');
    }
});

// Handle preflight requests
app.options('/saveWinner', (req, res) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.send();
});

// Start the server
app.listen(PORT);
