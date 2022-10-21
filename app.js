require('dotenv').config()
const bcrypt=require('bcrypt');
const saltRounds=20;
const express= require('express');
const bodyParser=require('body-parser');
const ejs= require('ejs');
const mongoose= require('mongoose');
const app= express();
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
const prompt = require('prompt')
const alert= require ('alert')
const encrypt=require('mongoose-encryption');
//const prompt=require('prompt')
mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema= new mongoose.Schema({
    email:String,
    name:String,
    password:String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields:['password']})

const User=mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds,(err,hash)=>{
    const name= req.body.name;
    const userName=req.body.userName;
    const password=hash;


    const newUser=new User({
        email:userName,
        name:name,
        password:password   
       });
       User.findOne({email:userName}, (err, user) => {
           if(user){
               console.log(`${user.email} Already exists`);
               alert(`${user.email} already exist`)
               //res.send(`${user.email} already exist`)
               
       
               res.redirect('/register')
           }else{
               newUser.save((err)=>{
                   if(!err){
                       res.render('secret', {name:name})
       
       
                   }
           
                   }
               )
       
           }
       })
    
    }) 

    
})

app.post('/login', (req, res)=>{
    const userName=req.body.userName;
    const password=req.body.password;
User.findOne({email:userName}, (err,found)=>{
    if(err){
        console.log(err)
    } 
    else{
        if(found){
            bcrypt.compare(password, found.password, (err, result)=>{
                if (result===true){
                    res.render('secret', {name:found.name})
                }
            })
            
            }else{
                alert(`unmatch or wrong password or usernameS`)
                console.log(`umatched`);
                res.redirect('/login')
            }
        }
    })
})



app.listen(3000, function () {
    console.log(`i am listening`);
})
