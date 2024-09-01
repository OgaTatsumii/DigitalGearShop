class SearchController {
    // [GET] /news
    index(req, res) {
        res.send("<h1>DETAIL OF PRODUCTION</h1>");
    }

    // [GET] /news/:slug
    show(req, res) {
        res.send("NEWS DETAIL!!!");
    }
}

module.exports = new SearchController();
