const {
    mutipleMongooseToObject,
    mongooseToObject,
} = require("../../util/mongoose");
const Production = require("../model/Production");
const User = require("../model/Login");
const Order = require("../model/Order");
const cloudinary = require("../../util/cloundinary");
const upload = require("../middlewares/multer");
class SearchController {
    // [GET] /news
    index(req, res, next) {
        return res.redirect("/production/page/1");
        // Production.find()
        //     .then((productions) => {
        //         res.render("production", {
        //             productions: mutipleMongooseToObject(productions),
        //         });
        //     })

        //     .catch(next);
    }

    // [GET] /news/:slug
    show(req, res, next) {
        Production.findOne({ slug: req.params.slug })
            .then((production) => {
                if (!production) {
                    // Xử lý khi không tìm thấy sản phẩm
                    //   return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
                    return res
                        .status(400)
                        .render("error", { error: "Sản phẩm không tồn tại" });
                }

                // Tìm tất cả các sản phẩm có cùng type
                Production.find({ type: production.type })
                    .then((relatedProductions) => {
                        res.render("production/detail", {
                            production: mongooseToObject(production),
                            relatedProductions:
                                mutipleMongooseToObject(relatedProductions),
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }

    // [GET] /production/create
    create(req, res, next) {
        req.session.error_original_prices = "";
        req.session.error_new_prices = "";
        req.session.error_deadline = "";
        req.session.error_namePCreate = "";
        res.render("production/create");
    }
    // [POST] /production/store
    store(req, res, next) {
        upload.array("image[]")(req, res, async (err) => {
            if (err) {
                // xử lý lỗi nếu có
                return next(err);
            }
            try {
                // kiểm tra xem sản phẩm đã tồn tại trong db chưa
                let productname = req.body.name;
                productname = productname.toLowerCase();
                productname = productname.split(" ").join("");
                // let productName = productname.split(' ').join('');
                let product = await Production.find({}).lean(); // vào db Prodcution lấy tất cả dữ liệu
                // console.log("product: ", product);
                //ktra giá tiền không được nhỏ hơn 0
                let price = req.body.new_prices;
                let Price = req.body.original_prices;
                let existingPrices = false;
                if (price <= 0 || Price <= 0) {
                    if (Price <= 0) {
                        existingPrices = true;
                        req.session.error_original_prices =
                            "Lỗi: Giá gốc không hợp lệ";
                    }
                    if (price <= 0) {
                        existingPrices = true;
                        // return res.status(404).json({ message: 'Giá tiền không hợp lệ' });
                        // return res.render('error', {error: 'Giá tiền không hợp lệ'});
                        req.session.error_new_prices =
                            "Lỗi: Giá bán không hợp lệ";
                    }
                }

                //ktra ngày ngừng kinh doanh phải lớn hơn ngày nhập sp
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const day1 = String(today.getDate()).padStart(2, "0");
                const year = today.getFullYear();
                today = `${year}-${month}-${day1}`;
                today = new Date(today);
                console.log(today);
                let day = req.body.deadline;
                day = new Date(day);
                day.setUTCHours(0, 0, 0, 0);
                console.log(day);
                let validDeadline = false;
                if(day <= today ){
                    validDeadline = true;
                    // return res.status(404).json({ message: 'Hạn ngừng kinh doanh không hợp lệ' });
                    req.session.error_deadline =
                    "Lỗi: Hạn ngừng kinh doanh không hợp lệ";
                }

                //ktra sp có bị trùng tên trong db hay không
                let existingProduct = false;
                product.forEach((item) => {
                    let ItemName = item.name;
                    ItemName = ItemName.toLowerCase();
                    ItemName = ItemName.split(" ").join("");
                    if (productname === ItemName) {
                        existingProduct = true;
                        req.session.error_namePCreate = "Lỗi: Sản phẩm bị trùng"
                    }
                });

                if (existingProduct == false && existingPrices == false && validDeadline == false) {
                    const result = await Promise.all(
                        req.files.map((file) =>
                            cloudinary.uploader.upload(file.path)
                        )
                    );
                    // lấy đường dẫn của các file ảnh sau khi upload lên Cloudinaryư
                    const imageUrls = result.map((r) => r.secure_url);

                    // lưu thông tin sản phẩm vào database
                    const production = new Production({
                        name: req.body.name,
                        original_prices: req.body.original_prices,
                        new_prices: req.body.new_prices,
                        profitPerProduct:req.body.new_prices - req.body.original_prices,
                        type: req.body.type,
                        factory: req.body.factory,
                        ensure: req.body.ensure,
                        deadline: req.body.deadline,
                        quantity: req.body.quantity,
                        total_quantity: req.body.quantity,
                        image: [], // lưu đường dẫn ảnh vào database
                    });

                    // Thêm các đường dẫn vào mảng image
                    imageUrls.forEach((url) => {
                        production.image.push(url);
                    });

                    await production.save();
                    res.redirect(`/admin/stored/production`);
                }else {
                    return res.redirect('back')
                }
            } catch (error) {
                // xử lý lỗi nếu có
                next(error);
            }
        });
    }
    // [GET] /production/:id/edit
    edit(req, res, next) {
        Production.findById(req.params.id)
            .then((productions) =>
                res.render("production/edit", {
                    productions: mongooseToObject(productions),
                })
            )
            .catch(next);
    }

    // [PUT] /production/:id
    update(req, res, next) {
        const { id } = req.params;
        const quantity = req.body.quantity;
        Production.findById(id)
            .then((production) => {
                production.total_quantity = production.quantity;

                if (quantity > production.quantity) {
                    production.total_quantity += quantity - production.quantity;
                }
                production.profitPerProduct =
                    production.new_prices - production.original_prices;
                Object.assign(production, req.body); // hợp nhất object từ phải sang trái trùng key thì ghi đè lên
                return production.save();
            })
            .then(() => res.redirect("/admin/stored/production"))
            .catch(next);
    }

    // [DELETE] /production/:id
    delete(req, res, next) {
        Production.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [DELETE] /production/:id/force
    forceDelete(req, res, next) {
        Production.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    forceDeleteOrder(req, res, next) {
        Order.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PATCH] /production/:id/store
    restore(req, res, next) {
        Production.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    // [POST] /production/:id/store
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                Production.delete({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "restore":
                Production.restore({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            case "forceDelete":
                Production.deleteMany({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                // res.json({ message: "Action is invalid" });
                res.render("error", { error: "Action is invalid" });
        }
    }
    //[GET] /type/"type"
    type(req, res, next) {
        let type = req.params.type;
        req.session.type = type;
        return res.redirect(`/production/type/${type}/page/1`);
    }

    typepagination(req, res, next) {
        let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1;
        let type = req.params.type;
        Production.find({ type: req.params.type })
            .lean()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .then((productions) => {
                Production.countDocuments({ type: req.params.type })
                    .then((count) => {
                        if (count != 0) {
                            return res.render("production/type", {
                                productions,
                                type: req.params.type,
                                current: Number(page), // page hiện tại
                                totalPages: Math.ceil(count / perPage), // tổng số các page
                            });
                        } else {
                            return res.render("production/type", {
                                noProducts: "Không có sản phẩm",
                            });
                        }
                    })
                    .catch((err) => {
                        return next(err);
                    });
            });
    }

    sortpagination(req, res, next) {
        let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1;
        let type = req.params.type;
        // --------------
        let productionQuery = Production.find({});
        let countQuery = Production.countDocuments({});

        if (req.session.createdAt === "Latest") {
            productionQuery = productionQuery.sort({
                createdAt: "desc",
            });
        } else if (req.session.createdAt === "Oldest") {
            productionQuery = productionQuery.sort({
                createdAt: "asc",
            });
        } else if (req.session.createdAt === "PriceIncr") {
            productionQuery = productionQuery.sort({
                new_prices: "asc",
            });
        } else if (req.session.createdAt === "PriceDesc") {
            productionQuery = productionQuery.sort({
                new_prices: "desc",
            });
        } else if (req.session.createdAt === "NameA-Z") {
            productionQuery = productionQuery.sort({
                name: "asc",
            });
        } else{
            productionQuery = productionQuery.sort({
                name: "desc",
            });
        }
        let sort = "sort";
        Promise.all([
            productionQuery
                .lean()
                .skip(perPage * page - perPage)
                .limit(perPage),
            countQuery,
        ])
            .then(([productions, count]) => {
                res.render("production", {
                    productions: productions,
                    current: Number(page), // page hiện tại
                    totalPages: Math.ceil(count / perPage), // tổng số các page
                    sort,
                });
            })
            .catch((error) => next(error));
    }
    sortTypepagination(req, res, next) {
        let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1;
        let type = req.params.type;

        let productionQuery = Production.find({ type: req.session.type });
        let countQuery = Production.countDocuments({ type: req.session.type });

        if (req.session.createdAt === "Latest") {
            productionQuery = productionQuery.sort({
                createdAt: "desc",
            });
        } else if (req.session.createdAt === "Oldest") {
            productionQuery = productionQuery.sort({
                createdAt: "asc",
            });
        } else if (req.session.createdAt === "PriceIncr") {
            productionQuery = productionQuery.sort({
                new_prices: "asc",
            });
        } else if (req.session.createdAt === "PriceDesc") {
            productionQuery = productionQuery.sort({
                new_prices: "desc",
            });
        } else if (req.session.createdAt === "NameA-Z") {
            productionQuery = productionQuery.sort({
                name: "asc",
            });
        } else{
            productionQuery = productionQuery.sort({
                name: "desc",
            });
        }
        let sort = "sort";
        Promise.all([
            productionQuery
                .lean()
                .skip(perPage * page - perPage)
                .limit(perPage),
            countQuery,
        ])
            .then(([productions, count]) => {
                if (count !== 0) {
                    res.render("production/type", {
                        productions,
                        type: req.session.type,
                        current: Number(page), // page hiện tại
                        totalPages: Math.ceil(count / perPage), // tổng số các page
                        sort,
                    });
                } else {
                    res.render("production/type", {
                        noProducts: "Không có sản phẩm",
                    });
                }
            })
            .catch((error) => next(error));
    }

    searchDateView(req,res,next){
        const dateBegin = req.query.dateBegin;
        const dateEnd = req.query.dateEnd;
        Production.find({createdAt: { $gte: dateBegin, $lte: dateEnd }})
        .lean()
        .then(productions =>{
            if (productions.length !== 0) {
                res.render("production", {
                    productions,
                });
            } else {
                res.render("production", {
                    noProducts: "Không có sản phẩm",
                });
            }
        })
    }
    searchPriceViewPagination(req, res, next) {
        
        let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1;
        let type = req.params.type;
        const priceMin = req.session.priceMin;
        const priceMax = req.session.priceMax;
        let searchPrices = "searchPrices";
        let productionQuery = Production.find({ new_prices: { $gte: priceMin, $lte: priceMax } })
        let countQuery = Production.countDocuments({ new_prices: { $gte: priceMin, $lte: priceMax } });
        Promise.all([
            productionQuery
                .lean()
                .skip(perPage * page - perPage)
                .limit(perPage),
            countQuery,
        ])
            .then(([productions, count]) => {
                if (count !== 0) {
                    res.render("production", {
                        productions,
                        current: Number(page), // page hiện tại
                        totalPages: Math.ceil(count / perPage), // tổng số các page
                        searchPrices,
                    });
                } else {
                    res.render("production", {
                        noProducts: "Không có sản phẩm",
                    });
                }
            })
            .catch((error) => next(error));
    }

    // searchIndex(req, res, next) {
    //     const search = req.params.name;
    //     // const temp = search.split("/"); // Tách chuỗi thành mảng các phần tử dựa trên dấu "/"
    //     // const searchTerm = temp[0];
    //     console.log("searchIndex: ", search);
    //     return res.redirect(`/production/search/?name=${search}/page/1`);
    // }

    searchIndex(req, res, next) {
        let searchTerm = req.query.name;
        // console.log("searchTerm: ", searchTerm)
        let temp = searchTerm;
        if(isNaN(Number(temp))){
            Production.find({$or:  [{name: { $regex: searchTerm, $options: "i" }}, {type : { $regex: searchTerm, $options: "i" }}, {factory: { $regex: searchTerm, $options: "i" }}] })
            .lean()
            .then((productions) => {
                if(productions.length == 0){
                    return res.render('error', {error : "Không tìm thấy sản phẩm"})
                }
                res.render("production", { productions });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            });
        }else { // tìm theo giá tiền
            Production.find({ new_prices: Number(temp) })
            .lean()
            .then((productions) => {
                if(productions.length == 0){
                    return res.render('error', {error : "Không tìm thấy sản phẩm"})
                }
                res.render("production", { productions });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            });
        }
    }

    // searchIndex(req, res, next) {
    //     const searchTerm = req.query.name;
    //     // console.log("searchTerm: ", searchTerm)
    //     Production.find({ name: { $regex: searchTerm, $options: "i" } })
    //         .lean()
    //         .then((productions) => {
    //             res.render("production", { productions });
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             res.status(500).json({ error: "Internal server error" });
    //         });
    // }

    // [GET] /production/search
    search(req, res, next) {
        const searchTerm = req.query.name;
        // const temp = search.split("/"); // Tách chuỗi thành mảng các phần tử dựa trên dấu "/"
        // const searchTerm = temp[0];
        console.log("search: ", searchTerm);

        let perPage = 2; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page;
        Production.find({ name: { $regex: searchTerm, $options: "i" } })
            .lean()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .then((productions) => {
                // console.log("productions: ", productions);
                if (productions.length > 0) {
                    Production.countDocuments({
                        name: { $regex: searchTerm, $options: "i" },
                    })
                        .then((count) => {
                            if (count != 0) {
                                return res.render("production", {
                                    productions,
                                    searchTerm,
                                    current: Number(page), // page hiện tại
                                    totalPages: Math.ceil(count / perPage), // tổng số các page
                                });
                            } else {
                                return res.render("production", {
                                    noProducts:
                                        "Không tìm thấy sản phẩm phù hợppppp",
                                });
                            }
                        })
                        .catch((err) => {
                            return next(err);
                        });
                } else {
                    res.render("production", {
                        noProducts: "Không tìm thấy sản phẩm phù hợpp",
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                // res.status(500).json({ error: "Internal server error" });
                res.status(err.status || 500).render("error", {
                    error: "Internal server error",
                });
            });
    }

    pagination(req, res, next) {
        let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1;
        const today = new Date();
        today.setHours(23,23,23,23);
        console.log(today);
        Production.find({deadline: {$gt: today}})
            .lean()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .then((productions) => {
                Production.countDocuments({})
                    .then((count) => {
                        res.render("production", {
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

    dateSort(req, res, next) {
        console.log(req.query.createdAt);
        req.session.createdAt = req.query.createdAt;
        console.log(req.session.createdAt);
        res.redirect("/production/sort/date/page/1");
    }

    dateTypeSort(req, res, next) {
        req.session.createdAt = req.query.createdAt;
        res.redirect("/production/type/sort/date/product/page/1");
    }

    searchPriceView(req,res,next){
        
        const priceMin = req.query.priceMin;
        const priceMax = req.query.priceMax;
        req.session.priceMin = priceMin;
        req.session.priceMax = priceMax;
        res.redirect("/production/search/price/view/page/1");
    }
}

module.exports = new SearchController();
