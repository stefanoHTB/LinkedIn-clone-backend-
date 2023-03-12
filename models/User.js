const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            uniqure: true
        },
        password: {
            type: String,
            required: true,
        },
        name :{ 
            type: String,
            required: true,
        },
        lastName :{ 
            type: String,
            required: true,
        },
        profileImageNameURL: {
            type: String,
            default: ''
        },
        awsURL: {
            type: String,
            default: ''
        },


    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);
