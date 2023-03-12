const Post = require('../models/Post');
const { S3Client, PutObjectCommand, GetObjectCommand, } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');


//aws
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAcessKey = process.env.SECRET_ACCESS_KEY


//aws generate url
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")



const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAcessKey
    },
    region: bucketRegion
})


const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        if(!posts) return res.status(204).json({'message': 'No employees Found!'}) 

        for (const post of posts) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: post.postNameURL
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
            post.awsURL = url
            //-------------- real time data user
            const uid = post.ownerId
            const user = await User.findOne({ _id: uid }).exec()
            post.name = user.email
            post.lastName = user.lastName
            //prof image too
        }
        res.json(posts);

    } catch (err) {
        console.log(err);
    }
   
}



const createPost = async (req, res) => {
    // console.log(req.file.buffer)
    // console.log(req.body)

    if(!req.body?.description || !req.body?.ownerId) {
        return res.status(400).json({'meesage': 'fields required'})
    }
    try {
        // aws  
      const imageString = uuidv4();
      const params = {
        Bucket: bucketName,
        Key: imageString, //create unique file name so no ovverrides
        Body: req.file.buffer,
        ContentType: req.file.mimetype //tells s3 the type of file
      }
      const command = new PutObjectCommand(params)
      await s3.send(command)

      const newPost =  await Post.create({
        description: req.body.description,
        name: 'fdfd',
        lastName: 'fdf',
        ownerId: req.body.ownerId,
        postNameURL: imageString
      })
      
      res.status(201).json(newPost); 
        
    } catch (err) {
        console.error(err);
    }
}

module.exports = { createPost, getAllPosts }