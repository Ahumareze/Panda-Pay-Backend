const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jsonwebtoken = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());


//connect to mongodb
const dbUrl = 'mongodb+srv://panda:de51gner@panda.igjqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
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

// app.post('/signup', async (req, res) => {
//   User.find()
//     .then(async (r) => {
      
//       const exUser = r.find(user => user.username == req.body.username)
      

//         try{
//           const hashedPassword = await bcrypt.hash(req.body.password, 10)
//           const user = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//             nft: 0,
//             balance: 0,
//             history: []
//           })
//           user.save()
//             .then(result => res.send(result))
//             .catch(err => res.status(500).send('error saving user'))
//       }catch{
//         res.status(500).send()
//       }
//     })
//     .catch(e => {
//       res.status(404).send()
//     })
// });

app.post('/signup', (req, res) => {
  User.findOne({email: req.body.email})
    .then(r => {
      if(r){
        res.status(400).send({message: 'user already exists'});
      }else{
        signUpUser(req.body, res)
      }
    })
    .catch(e => {
      res.status(400).send({
        message: 'network error'
      })
    })
})

const signUpUser = async (data, res) => {
  try{
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
          balance: r.balance
        }
        const token = jsonwebtoken.sign(
          {user_id: data._id, email}, process.env.TOKEN_KEY, {expiresIn: "1d"}
        )
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
        res.status(400).send({message: 'user does not exist'})
      }
    })
    .catch(e => {
      res.status(400).send({message: 'error connecting to database'})
    })
});

const loginUser = async (user, data, res) => {
  const passTrue = await bcrypt.compare(data.password, user.password);
  if(passTrue){
    res.send('success')
  }else{
    res.status(400).send({message: 'user already exists'})
  }
}