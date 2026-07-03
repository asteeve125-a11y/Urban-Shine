const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static HTML files from the same directory

// Initialize SQLite Database
const db = new sqlite3.Database('./bookings.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            area TEXT,
            house TEXT,
            car TEXT,
            date TEXT,
            packageType TEXT,
            washType TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            city TEXT,
            rating INTEGER,
            reviewText TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Endpoint to handle new bookings
app.post('/api/bookings', (req, res) => {
    const { name, area, house, car, date, packageType, washType } = req.body;
    
    const query = `INSERT INTO bookings (name, area, house, car, date, packageType, washType) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [name, area, house, car, date, packageType, washType], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to save booking' });
        } else {
            res.status(201).json({ id: this.lastID, message: 'Booking saved successfully' });
        }
    });
});

// Endpoint to get all bookings for the admin panel
app.get('/api/bookings', (req, res) => {
    const query = `SELECT * FROM bookings ORDER BY created_at DESC`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve bookings' });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to handle new reviews
app.post('/api/reviews', (req, res) => {
    const { name, city, rating, reviewText } = req.body;
    
    const query = `INSERT INTO reviews (name, city, rating, reviewText) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [name, city, rating, reviewText], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to save review' });
        } else {
            res.status(201).json({ id: this.lastID, message: 'Review saved successfully' });
        }
    });
});

// Endpoint to get all reviews
app.get('/api/reviews', (req, res) => {
    const query = `SELECT * FROM reviews ORDER BY created_at DESC`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve reviews' });
        } else {
            res.json(rows);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
