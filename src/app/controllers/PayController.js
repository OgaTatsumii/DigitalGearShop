class PayController {
    // [GET] /news
    index(req, res) {
        res.render("pay");
    }

    // [GET] /news/:slug
    show(req, res) {
        res.send("PAY DETAIL!!!");
    }
}

module.exports = new PayController();
