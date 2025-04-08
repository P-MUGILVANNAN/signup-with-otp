const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userController = require('./controller/UserController');
const googleSignupController = require('./controller/GoogleSignupController');


app.use(cors());
dotenv.config();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log('Error connecting to MongoDB', err);
})

app.use('/api/auth', userController);
app.use('/api/auth', googleSignupController);

app.get('/',(req,res)=>{
    res.send("Welcome to Express App");
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})