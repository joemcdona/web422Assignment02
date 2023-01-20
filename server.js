
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Joseph McDonald Student ID: 060257144 Date: 20/01/2023
*  Cyclic Link: https://dark-tan-flannel-nightgown.cyclic.app
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config(); 
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.get('/', (req, res) => {
  res.json({"message":"API Listening"});
});

app.post('/api/movies', (req, res) =>{
    db.addNewMovie(req.body).then((data) =>{
        console.log(data);
        res.status(201).json(data);
    }).catch(function()
    {
        res.status(500).send("Unable to Create Movie");
    });
});

app.get('/api/movies', (req, res) =>{
    if(req.query.page && req.query.perPage)
    {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
            data = data.map(value => value.toObject());
            if(data.length > 0)
            {
                res.status(200).json(data);
            }
            else
            {
                res.status(404).send("File not Found");
            }
        }).catch((err)=>{
            console.log(err);
            res.status(500).send("Unable to Get Movies");
        });
    }   
});

app.get('/api/movies/:_id', (req, res) =>{
    db.getMovieById(req.params._id).then((data)=> {      
        if(data)
        {
            data = data.toObject();
            res.status(200).json(data);
        }
        else
        {
            res.status(404).send("File not Found");
        }
    }).catch((err)=>{
        console.log(err);
        res.status(500).send("Unable to Get Movie");
    });
});

app.put('/api/movies/:_id', (req, res) =>{
    db.updateMovieById(req.body, req.params._id).then(() => {
        res.status(200).send("Successfuly Updated Movie.");
    }).catch((err)=>{
        console.log(err);
        res.status(500).send("Unable to Update Movie");
    });
});

app.delete('/api/movies/:_id', (req, res) =>{
    db.deleteMovieById(req.params._id).then(()=> {
        res.status(200).send("Successfuly Deleted Movie.");
    }).catch((err)=>{
        console.log(err);
        res.status(500).send("Unable to Delete Movie");
    });
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});