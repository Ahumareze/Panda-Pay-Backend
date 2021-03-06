const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    nft: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    history: {
        type: Array,
        required: true
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User