const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbPassword = encodeURIComponent('konal@23'); // URL-encode the password
const dbName = 'enigma';
const dbURI = `mongodb+srv://purikonal23:${dbPassword}@cluster0.bnqnj.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
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

    // Validate request body
    if (!name || !score) {
        return res.status(400).send('Name and score are required');
    }

    try {
        const winner = new Winner({ name, score });
        await winner.save();
        res.status(201).send('Winner data saved successfully');
    } catch (error) {
        console.error('Error saving winner data:', error); // Log the full error
        res.status(500).send('Error saving winner data');
    }
});



// Route to fetch high scores
app.get('/winners', async (req, res) => {
    try {
        // Fetch all winners from the database, sorted by score in descending order
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