const detailRouter = require("./detail");
const siteRouter = require("./site");
const adminRouter = require("./admin");
const payRouter = require("./pay");
const productionRouter = require("./production");
const loginRouter = require("./login");
const cartRouter = require("./cart");

function route(app) {
    app.use("/detail", detailRouter);
    app.use("/pay", payRouter);
    app.use("/production", productionRouter);
    app.use("/admin", adminRouter);
    app.use("/cart", cartRouter);
    app.use("/", loginRouter)
    app.use("/", siteRouter);
}

module.exports = route;
