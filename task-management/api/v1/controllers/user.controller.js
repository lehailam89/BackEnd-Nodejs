const md5 = require("md5");
const User = require("../models/user.model.js");
const ForgotPassword = require("../models/forgot-password.model.js");
const generateHelper = require("../../../helpers/generate.js");
const sendMailHelper = require("../../../helpers/sendMail");


//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail){
        return res.json({
            code: 400,
            message: "Email đã tồn tại!"
        });
    }else{
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: generateHelper.generateRandomString(30)
        });

        user.save();
        
        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Đăng ký thành công!",
            token: token
        });
    }
};

////[POST] /api/v1/users/login
module.exports.login = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        res.json({
            code: 400,
            message:"Email không tồn tại!"
        });
        return;
    }

    if(md5(password) !== user.password){
        res.json({
            code: 400,
            message: "Sai mật khẩu!"
        });
        return;
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công thành công!",
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email
        },
        token: token
    });
};

////[POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async(req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if(!user){
        res.json({
            code: 400,
            message: "Email không tồn tại"
        });
        return;
    }

    const otp = generateHelper.generateRandomNumber(8);

    const timeExpire = 5;

    //Lưu data vào database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire * 60 * 1000
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    //Gửi otp qua email khách hàng-user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> Sẽ có thời hạn sử dụng trong vòng ${timeExpire} phút.
                  Vui lòng không chia sẻ mã OTP với bất kì ai!!!
    `;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email"
    });
}

////[POST] /api/v1/users/password/otp
module.exports.otpPassword = async(req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!result){
        res.json({
            code: 400,
            message: "Mã OTP không hợp lệ!"
        });
        return;
    }

    const user = await User.findOne({
        email: email
    });

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Mã OTP hợp lệ!",
        token: token
    });
}

////[POST] /api/v1/users/password/reset
module.exports.resetPassword = async(req, res) => {
    const token = req.body.token;
    const password = req.body.password;

    const user = await User.findOne({
        token: token,
        deleted: false 
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Người dùng không tồn tại hoặc đã bị xóa."
        });
        return;
    }

    if(md5(password) === user.password){
        res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ."
        });
        return;
    }

    await User.updateOne(
        {
            token: token,
        },
        {
            password: md5(password),
        }
    )

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công!!"
    });
}

////[GET] /api/v1/users/detail
module.exports.detail = async(req, res) => {
    const token = req.cookies.token;

    const user = await User.findOne({
        token: token,
        deleted: false
    }).select("-password -token");

    res.json({
        code: 200,
        message: "Thành công",
        info: user
    })
}

////[POST] /api/v1/users/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.json({
        code: 200,
        message: "Đăng xuất thành công!"
    });
};

///[GET] /api/v1/users/list
module.exports.list = async (req, res) => {
    const users = await User.find({
        deleted: false
    }).select("fullName email");

    res.json({
        code: 200,
        message: "Thành công!!",
        users: users
    })
}