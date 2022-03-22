const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { is } = require('express/lib/request');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {
    username: 'king',
    email: 'king@gmail.com',
    password: '1234567',
    id: 1,
    balance: 200,
    nft: 'google.com'
  }
];

app.post('/users', (req, res) => {
  const user = users.find(user => user.username == req.body.username);
  
  if(user){
    res.send(user)
  }else{
    console.error('no user found')
  }
})

app.listen(PORT);

//username
//email
//password
//id
//balance
//nft
//history []
    //item{}
      //username
      //date
      //nft
      //amount
      //type