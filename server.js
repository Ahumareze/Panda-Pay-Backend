const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const { findOneAndUpdate, findById } = require('./models/user');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());


//connect to mongodb
const dbUrl = process.env.dbUrl;
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(r => {
    console.log('connected to db ' + r);
    app.listen(PORT);
  })
  .catch(e => console.log(e));

//Main code

app.get('/users', (req, res) => {
  User.find()
    .then(r => {
      res.send(r)
    })
    .catch(e => {
      res.send(e)
    })
});

app.post('/user',(req, res) => {
  User.findById(req.body.id)
    .then(r => {
      res.send(r)
    })
    .catch(e => {
      req.status(400).json({message: 'error fetching user'})
    })
})

app.post('/reciever', (req, res) => {
  User.findOne({email: req.body.email})
    .then(r => {
      if(r){
        res.send(r)
      }else{
        res.status(400).json({message: 'user does not exists'});
      }
    })
    .catch(e => {
      res.status(400).json({message: 'error finding user'});
    })
})

app.post('/signup', (req, res) => {
  User.findOne({email: req.body.email})
    .then(r => {
      if(r){
        res.status(400).json({message: 'user already exists'});
      }else{
        signUpUser(req.body, res)
      }
    })
    .catch(e => {
      res.status(400).send('network error')
    })
})

const signUpUser = async (data, res) => {
  try{

    //Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      nft: 0,
      balance: 0,
      history: []
    })
    user.save()
      .then(async r => {
        const data = {
          username: r.username,
          id: r._id,
          email: r.email,
          balance: r.balance,
          nft: r.nft
        }

        //generate token
        const token = jwt.sign(
          {user_id: data._id}, process.env.TOKEN_KEY, {expiresIn: "1d"}
        );
        res.send({...data, token})
      })
      .catch(

      )
  }catch{
    console.log('err hashing password')
  }
}

app.post('/login', (req, res) => {
  User.findOne({email: req.body.email})
    .then(r => {
      if(r){
        loginUser(r, req.body, res)
      }else{
        res.status(400).json({message: 'user does not exist'})
      }
    })
    .catch(e => {
      res.status(400).send('error connecting to database')
    })
});

const loginUser = async (user, data, res) => {
  const passTrue = await bcrypt.compare(data.password, user.password);
  if(passTrue){
    User.findOne({email: data.email})
      .then(r => {

        //generate token
        const token = jwt.sign(
          {user_id: r._id}, process.env.TOKEN_KEY, {expiresIn: "1d"}
        );
        const data = {
          username: r.username,
          id: r._id,
          email: r.email,
          nft: r.nft,
          token
        }
        res.send(data)
      })
      .catch(e => {
        res.status(500).send()
      })
  }else{
    res.status(400).json({message: 'incorrect password'})
  }
};

app.post('/transfer', (req, res) => {
  User.findById(req.body.sender)
    .then(r => {
      if(r.balance < req.body.amount){
        res.status(500).json({message: "Insufficent balance"})
      }else{
        User.findById(req.body.reciever)
        .then(rsult => {
          transferMainFunction(r, rsult, req.body.amount, req.body.date, res)
        })
        .catch(e => {
          console.log(e)
        })
      }
      
    })
    .catch(e => {
      res.status(400).json({message: 'error transfering money'})
    })
});

const transferMainFunction = (sender, reciever, amount, date, res) => {
  
  const senderBalance = sender.balance - amount;
  const recieverBalance = reciever.balance + amount;

  const senderHistory = [...sender.history, {
    name: reciever.username,
    nft: reciever.nft,
    amount,
    date,
    type: 'debit'
  }];

  const recieverHistory = [...reciever.history, {
    name: sender.username,
    nft: sender.nft,
    amount,
    date,
    type: 'credit'
  }]

  User.findByIdAndUpdate(sender._id, {history: senderHistory, balance: senderBalance})
    .then(r => {
      postRecieverData(reciever._id, recieverBalance, recieverHistory, res)
    })
    .catch(e => {
      res.status(400).json({message: "error updating balance"})
    })

  // res.send(newSenderData)
};

const postRecieverData = (id, balance, history, res) => {
  User.findByIdAndUpdate(id, {history: history, balance: balance})
    .then(r => {
      res.send('success')
    })
    .catch(e => {
      res.status(400).json({message: "error updating balance"})
    })
};

app.post('/updateNft', (req, res) => {
  User.findByIdAndUpdate(req.body.id, {nft: req.body.nft})
    .then(r => {
      res.send(r)
    })
    .catch(e => {
      res.status(400).json({message: e})
    })
})