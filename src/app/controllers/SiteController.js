const Production = require("../model/Production");
const {
    mutipleMongooseToObject,
    mongooseToObject,
} = require("../../util/mongoose");

class SiteController {
    // [GET] /
    index(req, res,next) {
        return res.redirect("/page/1");
        // Production.find({}).lean()
        //       .then((productions) => {
        //         res.render("home", {productions,
        //         });
        //       })
        //       .catch(next);
        // res.render("home");
    }

    pagination(req,res,next){
        let perPage = 15; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1;
        Production.find({})
            .lean()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .then((productions) => {
                Production.countDocuments({})
                    .then((count) => {
                        res.render("home", {
                            productions,
                            current: Number(page), // page hiện tại
                            totalPages: Math.ceil(count / perPage), // tổng số các page
                        });
                    })
                    .catch((err) => {
                        return next(err);
                    });
            });
    }

    // [GET] /search
    search(req, res) {
        res.send("SEARCH!!!");
    }
}

module.exports = new SiteController();
