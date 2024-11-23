const Task = require("../models/task.model");

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
};

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
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
};