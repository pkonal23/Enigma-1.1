require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Use port from .env

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${dbPassword}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?${process.env.MONGO_OPTIONS}`;

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
