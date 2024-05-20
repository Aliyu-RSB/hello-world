var express = require('express');
let newsfeed = require("./newsfeed");
let bodyParser = require('body-parser');
let morgan = require('morgan')
const multer = require("multer")
const upload = multer()
const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017/")

var app = express();

const personSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String
})

let Person = mongoose.model("Person", personSchema);

app.use(morgan('combined'))
app.use(upload.array())


app.use("/newsfeed", newsfeed)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next){
    console.log("A new request received at " + Date.now());
    next();
});

app.use('/profile', function(req, res, next){
    console.log("A request for things received at " + Date.now());
    next();
 });

app.set('view engine', 'pug');
app.set('views','./views');



app.get('/views', function(req, res){
    res.render('first_view');
 });

 app.get("/person", (req, res)=>{
   res.render('person')
 })

 app.post("/create-person", async (req, res)=> {
   console.log("im coming to create a new person");
   let personInfo = req.body
   if (!personInfo.name || !personInfo.age || !personInfo.nationality) {
      res.render('show_message', {
         message: "Sorry you provided the wrong info", type: "error"
      })
   } else {
      let newPerson = new Person({
         name: personInfo.name,
         age:personInfo.age,
         nationality: personInfo.nationality
      })

      const savedPerson = await newPerson.save().then((res)=>{
         res.render("show_message", {message: "New person added", type: "success", person: personInfo})


      }).catch((error)=> {
         res.render("show_message", {message: "Database Error", type: "error"})

      })
     
      
   }
 })

 

 //Route handler
//  app.use(function(req, res, next){
//     console.log("Start");
//     next();
//  });
//  app.use('/', function(req, res){
//     console.log('End');
//  });
//  app.get('/', function(req, res, next){
//     res.send("Middle");
//     next();
//  });
 
 

//  app.get('/profile', function(req, res){
//     res.send('Things');
//  });


app.get('/', function (req, res) {
  res.send('Hi Welcome To your Home Page')
})




app.get('/profile', function(req, res){
    res.send("Welcome this is your profile Mr/Mrs");
 });
 
//  app.get('/profile', function(req, res){
//     res.send("Welcome to your profile");
//  });
 
 app.post('/profile', function(req, res){
    res.send("You just called the post method at '/profile'!\n");
 });

 app.get('/profile/:id', function(req, res){
    res.send('The Profile you specified is ' + req.params.id);
 });
 
 app.get('/home/:name/:id', function(req, res) {
    res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
 });

 app.get('/things/:id([0-9]{5})', function(req, res){
    res.send('id: ' + req.params.id);
 });




 app.get('*', function(req, res){
    res.send('404 NOT FOUND');
 });

 




 app.listen("8000", ()=>{
    console.log("starting server")
});