const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination"); 
const searchHelper = require("../../../helpers/search");
const User = require("../models/user.model.js");

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const token = req.cookies.token;

    const user = await User.findOne({
        token: token,
        deleted: false
    }).select("_id");

    if (!user) {
        return res.json({
            code: 400,
            message: "Người dùng không tồn tại hoặc đã bị xóa."
        });
    }

    const userId = user._id; // Lấy ID của user hiện tại

    const find = {
        $or: [
            { createdBy: userId },
            { listUser: userId }
        ],
        deleted: false
    };

    if(req.query.status){
        find.status = req.query.status;
    }

    let objectSearch = searchHelper(req.query);

    if(req.query.keyword) {
        find.title = objectSearch.regex;
    }
    //Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 3,
    };
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );
    //End Pagination

    //Sort
    const sort = {}

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.json({
        tasks: tasks,
        totalPages: objectPagination.totalPage
    });
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

//[PATCH] api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try{
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id: id,

        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error){
        res.json({
            code: 400,
            message: "Không tồn tại task"
        })
    }
};

//[PATCH] /api/v1/change-multi
module.exports.changeMulti = async (req, res) => {
    try{
        const { ids, key, value } = req.body;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                }); 
                break;
            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletdAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Xoá nhiều nhiệm vụ thành công!"
                }); 
                break;
            default:
                break;
        }
       
    }catch(err){
        res.json("Không tim thấy task");
    }
}

//[POST] /api/v1/create
module.exports.create = async (req, res) => {
     const token = req.cookies.token;
    const user = await User.findOne({
        token: token,
        deleted: false
    }).select("-password");

    try{
        console.log(user.id);
        req.body.createdBy = user.id;
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            message: "Tạo nhiệm vụ mới thành công!",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        });
    }
};

//[PATCH] /api/v1/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;

        await Task.updateOne({ _id: id}, req.body);
        
        res.json({
            code: 200,
            message: "Cập nhật nhiệm vụ thành công!!"
        })
    }catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

//[DELETE] /api/v1/delete/:id
module.exports.delete = async (req, res) => {
    try{
        const id = req.params.id;

        await Task.updateOne({ _id: id}, 
            {
                deleted: true,
                deletedAt: new Date()
            });
        
        res.json({
            code: 200,
            message: "Xoá nhiệm vụ thành công"
        })
    }catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}