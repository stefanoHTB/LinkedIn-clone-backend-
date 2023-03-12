require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());


app.use('/auth', require('./routes/authRoutes'));
app.use('/post', require('./routes/postRoutes'));


mongoose.connect(process.env.MONGO_URL, {

}).then(() => {
    app.listen(PORT, () => console.log(`SERVER PORT ${PORT}`));
}).catch((error) => console.log(`${error}`));


