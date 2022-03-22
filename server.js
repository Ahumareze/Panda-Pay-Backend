const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {username: 'king', email: 'king@gmail.com', id: 0, balance: 100},
  {username: 'martin', email: 'martin@gmail.com', id: 1, balance: 200},
  {username: 'sarah', email: 'sarah@gmail.com', id: 2, balance: 300},
]

app.get('/', (req, res) => {
  res.send(users)
});

app.get('/user', (req, res) => {
  const username  = req.body.username;
  res.send(username)
});

app.listen(PORT)