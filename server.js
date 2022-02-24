const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

const app = express();
app.use(express.json());

const transport = {
    host: 'smtp.gmail.com',
    auth: {
        user: 'pandamailingservice@gmail.com',
        pass: 'de51gner'
    }
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((err, suss) => {
    if(err){
        console.log(err)
    }else{
        console.log(suss + ' Server is ready to take messages')
    }
})

app.get('/msg', (req, res) => {
    var mail = {
        from: 'panda',
        to: 'ahumarezeifeanyi001@gmail.com',  //Change to email address that you want to receive messages on
        subject: 'Pool party request',
        text: 'Helo there wanna come to my pool?'
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            msg: 'fail'
          })
        } else {
          res.json({
            msg: 'success ' + data
          })
        }
    })
})

const users = []

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password
    };
    users.push(user);
    res.status(201).send()
})

app.listen(3000)