const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log('Server running at http://localhost:3000');
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DataRojo1962?!',
    database: 'firstDatabase'
});

app.get('/hello-user', (req, res) => {
    const sql = 'SELECT * FROM users LIMIT 1';

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database Error');
        }

        if (results.length === 0) {
            return res.send('No user found');
        }

        const user = results[0];
        res.send('Hello, ' + user.firstName + '!');
    });
});

const crypto = require('crypto');

app.post('/login', (req, res) => {
    const username = req.body.username;

    const hashedPassword = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex');

    const sql = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            res.send(`Welcome back, ${results[0].firstName}!`);
        } else {
            res.send('Invalid username or password.');
        }
    });
});
