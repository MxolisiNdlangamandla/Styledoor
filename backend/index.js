const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP default is empty
  database: 'crew_app'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Example: Add a user
app.post('/users', (req, res) => {
  const { first_name, last_name, email, password_hash, phone_number, status } = req.body;
  db.query(
    'INSERT INTO users (first_name, last_name, email, password_hash, phone_number, status) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name, email, password_hash, phone_number, status],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ id: result.insertId });
    }
  );
});

app.listen(5000, () => console.log('Server running on port 5000'));