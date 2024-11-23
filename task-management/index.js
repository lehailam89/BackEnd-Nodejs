const express = require('express');
const cors = require('cors');
const database = require('./config/database');
require('dotenv').config();
const app = express();
app.use(cors()); // Bật CORS cho tất cả các nguồn
const port = process.env.PORT || 3000; 

database.connect();

const Task = require("./models/task.model");

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
});

app.get("/tasks/detail/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
    
        res.json(task);
    }catch(err){
        res.json("Không tim thấy task");
    }
});

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});