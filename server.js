const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

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

// app.get('/msg', (req, res) => {
//     var mail = {
//         from: 'panda',
//         to: 'ahumarezeifeanyi001@gmail.com',  //Change to email address that you want to receive messages on
//         subject: 'Pool party request',
//         text: 'Helo there wanna come to my pool?'
//     }
//     transporter.sendMail(mail, (err, data) => {
//         if (err) {
//           res.json({
//             msg: 'fail'
//           })
//         } else {
//           res.json({
//             msg: 'success ' + data
//           })
//         }
//     })
// })

app.post('/sendmessage', (req, res) => {
    const data = (req.body);
    var mail = {
        from: data.name,
        subject: data.title,
        text: data.content,
        to: data.emails
    };
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

app.listen(PORT)