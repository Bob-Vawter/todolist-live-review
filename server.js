const express = require('express')
const app = express()
// set variables for using expess

const MongoClient = require('mongodb').MongoClient
//set variable for calling mongodb

const PORT = 2121
//arbitrary user defined, but it will be where you direct your localhost in explorer

require('dotenv').config()
//set to use .env so we can hide confidential info in env file

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//db specific variables, connection string comes from env file, dbname will be the name that db gets created and stored in mongo

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
//connect to mongo db, using connection string from env stored in dbconnecitonstr
//db variable is set to store the database


app.set('view engine', 'ejs')
//set to use ejs, which will be stored in views folder

app.use(express.static('public'))
//set to load files from public folder, js, css

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//set to use json for exchanging data between server and database

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
       //grabs all db items inside of todos db and set to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
        //sort and count the items in todo with a field of completed set to false
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
        //render both items to index.ejs file, variable names zebra, left will be available to ejs file
})
//initial page load - read part of crud


app.post('/createTodo', (req, res)=>{
        //createTodo will be the action in ejs file
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
        //create 1 item in db, data croms from ejs body.todoItem
    .then(result =>{
        console.log('Todo has been added!')
        //logs in server console
        res.redirect('/')
        //redirect is a return/reload of page after item is sent to db
    })
})
//post - create part of crud

app.put('/markComplete', (req, res)=>{
    //called from listen event in main.js
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //update one item in db may be better to target _id
        $set: {
            completed: true
        }
        //update the completed field status set to true(boolean value)
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
//put - update part of crud

app.put('/undo', (req, res)=>{
    //called from listen event in main.js
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
//put - update part of crud same as first put however this one is to set completed to false

app.delete('/deleteTodo', (req, res)=>{
    //called from a listen event in main.js
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //this will look through database for an item that matches data from DOM
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
//delete - delete part of crud
 
app.listen(process.env.PORT || PORT, ()=>{
    //set the port that the server is running on will catch calls coming to the part
    //process.env.PORT is for a server that will asign a port of its choice ie heroku
    console.log('Server is running, you better catch it!')
})    
