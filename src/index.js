const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
var morgan = require("morgan");
const methodOverride = require("method-override");
const slug = require("mongoose-slug-updater");
const multer = require("multer");
const nodemailer = require("nodemailer");
const app = express();
const port = 3009;

const ImageModel = require("./app/model/Production");
const Cart = require("./app/model/Cart");
const User = require("./app/model/Login");
const Product = require("./app/model/Production");

const SortMiddleware = require("./app/middlewares/SortMiddleware");

const session = require("express-session");

const route = require("./routes");
const db = require("./config/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(
    session({
        secret: "my-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(async function (req, res, next) {
    if (req.session.loggedIn == null) {
        req.session.loggedIn = false;
    }
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.username = req.session.username;
    res.locals.userId = req.session.userId;
    res.locals.email = req.session.email;
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    res.locals.error_new_prices = req.session.error_new_prices
    res.locals.error_original_prices =req.session.error_original_prices
    res.locals.error_deadline = req.session.error_deadline;
    res.locals.role = req.session.role;
    res.locals.error_namePCreate  = req.session.error_namePCreate 
    next();
});

app.use(async function (req, res, next) {
    let totalProduct = 0;
    Cart.find()
        .lean()
        .then((cart) => {
            // console.log("cartttttttttttt: ", cart)
            cart.forEach((item) => {
                if (item.userId == res.locals.userId) {
                    for (var i = 0; i < item.items.length; i++) {
                        totalProduct += 1;
                    }
                }
            });
            res.locals.totalProduct = totalProduct; // Chia sẻ totalQuantity với tất cả các route
            next();
        })
        .catch(next);
});

// app.use(async function (req,res,next){
//     let quantity = 0;
//     Product.find()
//     .lean()
//     .then((production))
// })

// xử lý yêu cầu đăng xuất
app.use("/logout", (req, res) => {
    // Xóa thông tin người dùng khỏi session
    req.session.destroy();
    res.redirect("/");
    console.log(req.session);
});

app.use("/recover", async (req, res) => {
    const email = req.body.email;
    let emailRecover = await User.findOne({ email });
    // console.log("emailRecover: ", emailRecover.email);
    if (emailRecover && emailRecover.email == email) {
        // console.log("email: ", email);

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hdlinh123@gmail.com", // generated ethereal user
                pass: "cpghgfejxwveyzsi", // generated ethereal password
            },
        });

        const randomNumber =
            Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        const mailOptions = {
            from: "hdlinh123@gmail.com", // địa chỉ email người gửi
            to: email, // địa chỉ email người nhận
            subject: "Mã xác nhận", // Tiêu đề email
            text: `Mã xác nhận của bạn là: ${randomNumber}`, // Nội dung email
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.render("recover-password", { email, randomNumber });
        } catch (error) {
            return res.json({
                message: "Lỗi",
                error,
            });
        }
    } else {
        return res.render("error",{ error: "Email này chưa được đăng ký" });
    }
});

app.get(
    "/middleware",

    function (req, res, next) {
        res.json({
            message: "Successfully",
            face: req.face,
        });
    }
);

db.connect();

//Custom middleWare
app.use(SortMiddleware);

app.use(express.static(path.join(__dirname, "public")));

// app.use(morgan("combined"));

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        helpers: require("./app/helpers/handlebars"),
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
