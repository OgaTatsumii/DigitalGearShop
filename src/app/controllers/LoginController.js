const User = require("../model/Login");
const Production = require("../model/Production");
const Order = require("../model/Order")

class loginController {
    // xử lý yêu cầu đăng ký
    // [POST] /register
    register(req, res, next) {
        const { username, email, password } = req.body;
        console.log("Data: ", req.body);
        User.findOne({ email })
            .lean()
            .then((existingUser) => {
                if (existingUser) {
                    //return res.render('../../resources/views/layouts/error', {err: 'Email tồn tại'})
                    return res
                        .status(400)
                        .json({ message: "Email đã được sử dụng" });
                }
                const user = new User({
                    username,
                    email,
                    password: password, //bcrypt.hashSync(password, 10), // mã hóa mật khẩu
                    role: "user",
                });
                user.save()
                    .then(() => {
                        //return res.json({ message: 'Đăng ký thành công' });
                        return res.render("success", {
                            success: "Bạn đã đăng ký tài khoản thành công",
                        });
                    })
                    .catch((err) => {
                        // xử lý lỗi nếu có
                        next(err);
                    });
            })
            .catch((err) => {
                // xử lý lỗi nếu có
                next(err);
            });
    }

    // ...
login(req, res, next) {
    const { username, email, password, role } = req.body;

    User.findOne({ email })
        .lean()
        .then((user) => {
            if (user) {
                if (user && password === user.password && email === user.email) {
                    if (req.session) {
                        req.session.loggedIn = true;
                        req.session.username = user.username;
                        req.session.email = user.email;
                        req.session.userId = user._id;
                        req.session.role = user.role;
                    } else {
                        console.log("Error Access");
                    }
                    if (user.role === "user") {
                        return res.redirect("/production");
                    } else {
                        return res.redirect("/admin/stored/production");
                    }
                } else {
                    const error = "Email hoặc mật khẩu không đúng";
                    return res.render('homelogin', {error})
                }
            } else {
                // return res.status(401).json({
                //     message: "Email hoặc mật khẩu không chính xác",
                // });
                const error = "Email hoặc mật khẩu không đúng";
                return res.render('homelogin', {error})
            }
        })
        .catch((err) => {
            // xử lý lỗi nếu có
            next(err);
        });
}
// ...


    account(req, res, next) {
        const userId = req.session.userId
        // console.log("req.session.userId: ", req.session.userId)
        User.findById(userId).lean()
            .then(user => {
                // console.log(user)
                req.session.error = '';
                req.session.success = '';
                return res.render('user/account-detail', {user})
            })
            .catch(next)
    }

    // myOrder(req, res, next) {
    //     const userId = req.session.userId;
    //     Order.findOne({ userId: userId })
    //       .lean()
    //       .then((order) => {
    //         console.log(order);
    //         return res.render('user/myOrder', { order });
    //       })
    //       .catch(next);
    //   }
      

    myOrder(req, res, next) {
        const userId = req.session.userId;
        Order.find({ userId: userId })
          .lean()
          .then((orders) => {
            console.log(orders);
            return res.render('user/myOrder', { orders });
          })
          .catch(next);
      }
      

    update(req, res, next) {
        let newPassword = req.body.newPassword || null;
        let confirmPassword = req.body.confirmPassword || null;
        console.log('userIddd: ', req.params.id);
        if (req.params.id) {
            if(newPassword && confirmPassword){
                if(newPassword === confirmPassword){
                    User.updateOne({ _id: req.params.id}, req.body)
                        .then(() => {
                            User.findById(req.params.id)
                            .then((user) => {
                                if(req.session.error){
                                    req.session.error = null;
                                }
                                user.password = newPassword;
                                user.save();
                                req.session.username = user.username;
                                const success = "Bạn đã cập nhật thông tin thành công";
                                if(req.session.error){
                                    req.session.success = null;
                                }
                                req.session.success = success;
                                return res.redirect('back');
                            })
                            .catch(next);
                        })
                    .catch(next);
                }else {
                    if(req.session.success){
                        req.session.success = null;
                    }
                    const error = "Mật khẩu nhập lại không trùng khớp";
                    req.session.error = error;
                    return res.redirect('back');
                } 
            } else {
                User.updateOne({ _id: req.params.id}, req.body)
                .then(() => {
                    User.findById(req.params.id)
                    .then((user) => {
                        if(req.session.error){
                            req.session.error = null;
                        }
                        req.session.username = user.username;
                        const success = "Bạn đã cập nhật thông tin thành công";
                        if(req.session.error){
                            req.session.success = null;
                        }
                        req.session.success = success;
                        return res.redirect('back');
                    })
                    .catch(next);
                })
            .catch(next);
                  
            }
            
        } else {
            return res.status(400).json({ message: "Invalid user ID" });
            // Hoặc res.redirect('/error-page');
        }
    }
    

    forgot(req, res, next){
        return res.render('user/forgot-password')
    }

    reset(req, res, next ){
        const email = req.body.email;
        const verification = req.body.verification;
        const ramdomNumber = req.body.ramdomNumber;
        if(verification == ramdomNumber){
            return res.render('user/reset-password', {email})
        }
        else(
            res.render('error',{error: 'Mã xác thực không hợp lệ'})
        )
    }

    resetSuccess(req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        const password_confirmation = req.body.password_confirmation;
        if(email && password == password_confirmation){
            User.findOne({email})
                .then((user) => {
                    user.password = password;
                    user.save();
                    return res.render('success', {success: "Lấy lại mật khẩu thành công"});
                })
                .catch(next)
        } else {
            return res.render('error', {error : "Mật khẩu nhập lại không trùng khớp"});
        }      
    }
}

module.exports = new loginController();
