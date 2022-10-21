require('dotenv').config()
const session= require('express-session');
const passport=require('passport')
const passportLocalMongoose=require('passport-local-mongoose')

const express= require('express');
const bodyParser=require('body-parser');
const ejs= require('ejs');
const mongoose= require('mongoose');
const app= express();
app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret:process.env.SECRET, 
resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

const alert= require ('alert')

//const prompt=require('prompt')
mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema= new mongoose.Schema({
    username:String,
    name:String,
    password:String,
    company:String
});
userSchema.plugin(passportLocalMongoose)

const User =mongoose.model('User', userSchema)

// passport.use(User.createStrategy());
// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
  
//   passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/secret', (req,res)=>{
    
        if(req.isAuthenticated()){
            res.render('secret')
        }else{
            res.redirect('/login')
        }

    })
    
//    app.get('/logout', function(req, res){
//     req.logout()
//     res.redirect('/')
    
//    })    


    
    

app.get('/login', (req, res) => {
    res.render('login')
})
app.get("/logout", (req, res) => {

    req.logout(function(err){
        if (err) { console.log(err) }
        else{res.redirect('/')}
        
      });
      
});

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    User.register({
        username:req.body.username, 
        name:req.body.name, 
        company:req.body.company
    },
    req.body.password,
         (err,user)=>{
        if(err){
            console.log(err);
            res.redirect('/register')
        }else{ 
                     passport.authenticate("local")(req,res, ()=>{
                    res.redirect('/secret')
                     })
                    }
        })
            
        
})

               
       
app.post('/login', (req, res)=>{
const user =new User({
    username:req.body.username,
    passport:req.body.password
})
req.login(user, function(err){
    if(err){
        console.log(err);
        
    }else{
        passport.authenticate("local")(req, res, function(){
            res.redirect('/secret')
        })
    }
   
})

})



app.listen(3000, function () {
    console.log(`i am listening`);
})
