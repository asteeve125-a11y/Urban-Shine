const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

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
            mobile TEXT,
            referredBy TEXT,
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

        // Safely try to add mobile and referredBy column if they don't exist
        db.run("ALTER TABLE bookings ADD COLUMN mobile TEXT", (err) => {});
        db.run("ALTER TABLE bookings ADD COLUMN referredBy TEXT", (err) => {});
    }
});

// Admin Authentication Logic
const ADMIN_EMAIL = 'urban.shine.gandhinagar@gmail.com';
const ADMIN_PASS = 'Behappy@6167';
const ADMIN_TOKEN = 'secret-admin-token-urbanshine'; // Simple token for this use case

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ADMIN_EMAIL,
        pass: 'nidcdincmtlkwcun' // App Password
    }
});

app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        res.json({ success: true, token: ADMIN_TOKEN });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Middleware to protect routes
function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized Access' });
    }
}

// Endpoint to handle new bookings
app.post('/api/bookings', (req, res) => {
    const { name, mobile, area, house, car, date, packageType, washType, grandTotal, referredBy } = req.body;
    
    const query = `INSERT INTO bookings (name, mobile, area, house, car, date, packageType, washType, referredBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [name, mobile, area, house, car, date, packageType, washType, referredBy], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to save booking' });
        } else {
            // Send email notification to Admin
            const mailOptions = {
                from: ADMIN_EMAIL,
                to: ADMIN_EMAIL,
                subject: `New Booking Alert: ${name}`,
                text: `You have a new booking from ${name}.\n\nDetails:\n- Mobile: ${mobile || 'N/A'} (WhatsApp: https://wa.me/+91${mobile})\n- Car: ${car}\n- Package: ${packageType}\n- Wash Type: ${washType}\n- Date: ${date}\n- Location: ${house}, ${area}\n- Grand Total: ₹${grandTotal}\n- Referred By: ${referredBy || 'None'}\n`,
                html: `
                    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                        <h2>New Booking from ${name}</h2>
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="margin-bottom: 8px;"><strong>Mobile:</strong> ${mobile || 'N/A'} 
                                ${mobile ? `<a href="https://wa.me/+91${mobile}" target="_blank" style="display:inline-block; background-color:#25D366; color:white; padding:4px 10px; text-decoration:none; border-radius:4px; font-size:12px; margin-left:10px; font-weight:bold;">💬 Message on WhatsApp</a>` : ''}
                            </li>
                            <li style="margin-bottom: 8px;"><strong>Car Model:</strong> ${car}</li>
                            <li style="margin-bottom: 8px;"><strong>Package:</strong> ${packageType}</li>
                            <li style="margin-bottom: 8px;"><strong>Wash Type:</strong> ${washType}</li>
                            <li style="margin-bottom: 8px;"><strong>Date:</strong> ${date}</li>
                            <li style="margin-bottom: 8px;"><strong>Location:</strong> ${house}, ${area}</li>
                            <li style="margin-bottom: 8px;"><strong>Grand Total:</strong> ₹${grandTotal}</li>
                            ${referredBy ? `<li style="margin-bottom: 8px;"><strong>Referred By:</strong> <span style="background: #ffd700; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${referredBy}</span></li>` : ''}
                        </ul>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email notification:', error);
                } else {
                    console.log('Email notification sent:', info.response);
                }
            });

            res.status(201).json({ id: this.lastID, message: 'Booking saved successfully' });
        }
    });
});

// Endpoint to get all bookings for the admin panel
app.get('/api/bookings', requireAdmin, (req, res) => {
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
            // Send email notification to Admin
            const mailOptions = {
                from: ADMIN_EMAIL,
                to: ADMIN_EMAIL,
                subject: `New Review Alert: ${rating} Stars from ${name}`,
                text: `You have received a new review from ${name}.\n\nDetails:\n- Rating: ${rating} Stars\n- City: ${city}\n- Review: ${reviewText}\n`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email notification for review:', error);
                } else {
                    console.log('Email notification sent for review:', info.response);
                }
            });

            res.status(201).json({ id: this.lastID, message: 'Review saved successfully' });
        }
    });
});

// Endpoint to get all reviews (Admin only)
app.get('/api/reviews', requireAdmin, (req, res) => {
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

// Endpoint to edit a review text (Admin only)
app.put('/api/reviews/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { reviewText } = req.body;
    
    if (!reviewText) {
        return res.status(400).json({ error: 'Review text is required' });
    }

    const query = `UPDATE reviews SET reviewText = ? WHERE id = ?`;
    db.run(query, [reviewText, id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to update review' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Review not found' });
        } else {
            res.json({ message: 'Review updated successfully' });
        }
    });
});

// Endpoint to get all reviews (Public)
app.get('/api/public-reviews', (req, res) => {
    const query = `SELECT name, city, rating, reviewText, created_at FROM reviews ORDER BY created_at DESC`;
    
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
