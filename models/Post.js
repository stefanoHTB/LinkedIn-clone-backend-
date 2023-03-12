const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    postNameURL: {
        type: String,
    },
    awsURL: {
        type: String,
        default: ''
    },
    profImageURL: {
        type: String,
    }
});


module.exports = mongoose.model("Post", postSchema);
