const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { S3Client, PutObjectCommand, GetObjectCommand, } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAcessKey = process.env.SECRET_ACCESS_KEY
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAcessKey
    },
    region: bucketRegion
})


const getUserInfo = async (req, res) => { 
    try {
        const { id } = req.body;

        const foundUser = new User.findOne()

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const changeUserProfileImg = async (req, res) => { 
    
    try {
        console.log(req.body)
            console.log(req.file.buffer)

        const { ownerId } = req.body;
        
        const imageString = uuidv4();
        const params = {
        Bucket: bucketName,
        Key: imageString, 
        Body: req.file.buffer,
        ContentType: req.file.mimetype 
      }
      const command = new PutObjectCommand(params)
      await s3.send(command)

      const user = await User.findOne({ _id: ownerId})

      user.profileImageNameURL = imageString; 
      const result = await user.save();
      res.json(result)

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const handleRegister = async (req, res) => {

    try {

     const { email, password, name, lastName } = req.body;
     const salt = await bcrypt.genSalt();
     const hashedPass = await bcrypt.hash(password, salt);

     const newUser = new User({
        email,
        password: hashedPass,
        name,
        lastName
     });
     const savedUser = await newUser.save();
     res.status(201).json(savedUser);

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
   
}

const handleLogin = async (req, res) => {
    try {

   const { email, password } = req.body;

   const user = await User.findOne({ email: email });

   if(!user) return res.status(400).json({ msg: 'user does not exist. '});

   const isMatch = await bcrypt.compare(password, user.password);
   if(!isMatch) return res.status(400).json({ msg: 'Invalid Credentials. '});

   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );

   delete user.password;
   res.status(200).json({ token, user})
   console.log(res)

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
   
}

module.exports = { handleLogin, handleRegister, changeUserProfileImg }