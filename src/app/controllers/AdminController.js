const {
    mutipleMongooseToObject,
    mongooseToObject,
} = require("../../util/mongoose");
const Production = require("../model/Production");
const User = require("../model/Login");
const Order = require("../model/Order");
const _ = require("lodash");

class adminController {
    // [GET] admin/stored/productions
    storedProductions(req, res, next) {
        // let courseQuery = Production.find({});

        Promise.all([
            Production.find({}).sortable(req),
            Production.countDocumentsDeleted(),
        ])
            .then(([productions, deletedCount]) =>
                res.render("production/stored", {
                    deletedCount,
                    productions: mutipleMongooseToObject(productions),
                })
            )
            .catch(next);
    }

    // [GET] admin/trash/productions
    trashProductions(req, res, next) {
        Production.findDeleted({})
            .lean()
            .then((productions) => {
                res.render("production/trash", {
                    productions: productions,
                });
            })

            .catch(next);
    }

    storedAccounts(req, res, next) {
        User.find({})
            .sortable(req)
            .then((user) =>
                res.render("account/user", {
                    user: mutipleMongooseToObject(user),
                })
            )
            .catch(next);
    }

    storedOrder(req, res, next) {
        //
        Promise.all([
            Order.find({}).sortable(req),
            Order.countDocumentsDeleted(),
        ])
            .then(([orders, deletedCount]) =>
                res.render("account/order", {
                    deletedCount,
                    orders: mutipleMongooseToObject(orders),
                })
            )
            .catch(next);
    }

    deleteAccount(req, res, next) {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }
    deleteOrder(req, res, next) {
        Order.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    edit(req, res, next) {
        const userId = req.params.id;
        console.log(userId);
        User.findById(userId)
            .lean()
            .then((user) => {
                // console.log(user)
                return res.render("account/edit", { user });
            })
            .catch(next);
    }

    situationSearch(req, res, next) {
        switch (req.query.situation) {
            case "Stocking":
                Production.find({ quantity: { $gt: 0 } })
                    .lean()
                    .then((productions) => {
                        res.render("production/stored", {
                            productions: productions,
                        });
                    })
                    .catch((error) => next(error));
                break;
            case "OutofStock":
                Production.find({ quantity: 0 })
                    .lean()
                    .then((productions) => {
                        res.render("production/stored", {
                            productions: productions,
                        });
                    })
                    .catch((error) => next(error));
                break;
            default:
                res.render("error", { error: "Action is invalid" });
        }
    }

    situationSearchOrder(req, res, next) {
        const situation = req.query.situation;
        switch (situation) {
            case "All":
                Order.find({})
                    .lean()
                    .then((orders) => {
                        res.render("account/order", {
                            orders: orders,
                        });
                    })
                    .catch((error) => next(error));
                break;
            case "Preparing":
                Order.find({ situation: "Preparing" })
                    .lean()
                    .then((orders) => {
                        res.render("account/order", {
                            orders: orders,
                        });
                    })
                    .catch((error) => next(error));
                break;
            case "Delivering":
                Order.find({ situation: "Delivering" })
                    .lean()
                    .then((orders) => {
                        res.render("account/order", {
                            orders: orders,
                        });
                    })
                    .catch((error) => next(error));
                break;
            case "Failed":
                Order.find({ situation: "Failed" })
                    .lean()
                    .then((orders) => {
                        res.render("account/order", {
                            orders: orders,
                        });
                    })
                    .catch((error) => next(error));
                break;
            case "Completed":
                Order.find({ situation: "Completed" })
                    .lean()
                    .then((orders) => {
                        res.render("account/order", {
                            orders: orders,
                        });
                    })
                    .catch((error) => next(error));
                break;
            case "Canceled":
                Order.find({ situation: "Canceled" })
                    .lean()
                    .then((orders) => {
                        res.render("account/order", {
                            orders: orders,
                        });
                    })
                    .catch((error) => next(error));
                break;
            default:
                res.render("error", { error: "Action is invalid" });
        }
    }
    myOrdersearch(req,res,next){
        const orderId = req.query.id;
        Order.find({_id: orderId}).lean()
        .then((orders)=>{
            // res.render("user/myOrder",{order})
            if (orders.length > 0) {
                return res.render("user/myOrder", {
                   orders
                });
            } else {
                const noProducts = "Không tìm thấy sản phẩm phù hợp";
                return res.render("user/myOrder", {
                    orders,
                    noProducts,
                });
            }
        })
        .catch(next);

    }
    search(req, res, next) {
        const searchTerm = req.query.name;
        const type = req.query.typeProduct;
        res.locals.searchTerm = searchTerm;
        res.locals.type = type;

        const searchCondition = {};
        if (searchTerm && !type) {
            searchCondition.name = { $regex: searchTerm, $options: "i" };
        } else if (!searchTerm && type) {
            searchCondition.type = type;
        } else if (searchTerm && type) {
            searchCondition.name = { $regex: searchTerm, $options: "i" };
            searchCondition.type = type;
        }

        Promise.all([
            Production.find(searchCondition).lean(),
            Production.countDocumentsDeleted(),
        ])
            .then(([productions, deletedCount]) => {
                if (productions.length > 0) {
                    return res.render("production/stored", {
                        deletedCount,
                        productions,
                    });
                } else {
                    const noProducts = "Không tìm thấy sản phẩm phù hợp";
                    return res.render("production/stored", {
                        deletedCount,
                        productions,
                        noProducts,
                    });
                }
            })
            .catch(next);
    }

    updateOrder(req, res, next) {
        Order.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("back"))
            .catch(next);
    }

    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                User.deleteMany({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                // res.json(req.body);
                break;
            default:
                // res.json({ message: "Action is invalid" });
                res.render("error", { error: "Action is invalid" });
        }
    }

    trashOrders(req, res, next) {
        Order.findDeleted({})
            .lean()
            .then((orders) => {
                res.render("account/order_trash", {
                    orders: orders,
                });
            })

            .catch(next);
    }

    priceSearch(req, res, next) {
        const priceMin = req.query.priceMin;
        const priceMax = req.query.priceMax;
        console.log(priceMin);
        console.log(priceMax);
        Production.find({ new_prices: { $gte: priceMin, $lte: priceMax } })
            .lean()
            .then((productions) => {
                if (productions.length > 0) {
                    return res.render("production/stored", {
                        productions: productions,
                    });
                } else {
                    const noProducts = "Không tìm thấy sản phẩm phù hợp";
                    return res.render("production/stored", {
                        productions: productions,
                        noProducts,
                    });
                }
            })
            .catch((error) => next(error));
    }

    async statistic(req, res, next) {
        let importMoney = 0;
        let toDaySale = 0;
        let totalSale = 0;
        let profitMoney = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây của ngày hiện tại về 0 để so sánh theo ngày


        // doanh thu hôm nay
        let order = await Order.find({ createdAt: { $gte: today } }).lean()
        // console.log("Order: ", order)
        order.forEach(item => {
            if(item.situation == "Completed"){
                toDaySale += +item.totalAmount;
            }
        })
        // console.log("toDaySale: ", toDaySale)
        
        // tổng doanh thu
        let AllOrder = await Order.find({}).lean()
        // console.log("AllOrder: ", AllOrder)
        AllOrder.forEach(item => {
            if(item.situation == "Completed"){
                totalSale += +item.totalAmount;
            }
        })
        //  console.log("totalSale: ", totalSale)
        
        // tổng tiền nhập hàng
        let production = await Production.find().lean();
        let totalimportMoneyPerP = [];
        production.forEach(item => {
            importMoney += +item.original_prices * +item.total_quantity;
            totalimportMoneyPerP.push(item);
        })

        totalimportMoneyPerP.forEach(item => {
            item.total = item.total_quantity * item.original_prices;
        })

        // tiền lời
        profitMoney = +totalSale - +importMoney;
        // console.log("profitMoney: ", profitMoney)

        // thời gian từng đơn hàng
        let timeEachOrder = [];
        AllOrder.forEach(item => { // biến AllOrder đã có ở phần tổng doanh thu
            timeEachOrder.push(item.createdAt.toISOString().slice(0, 10));
        });
        // console.log('timeEachOrder: ', timeEachOrder);
        
        //tổng doanh thu đối với đơn hàng thành công
        let completedSale =[];
        AllOrder.forEach(item => {
            if(item.situation == "Completed"){
                completedSale.push(item)
            }
        })
        // console.log("completedSale: ",completedSale)

        //số lượng đơn hàng đang chuẩn bị
        let preparingOrder = 0;
        AllOrder.forEach(item => {
            if(item.situation == "Preparing"){
                preparingOrder += 1;
            }
        })

        //số lượng đơn hàng đang giao
        let deliveringOrder = 0;
        AllOrder.forEach(item => {
            if(item.situation == "Delivering"){
                deliveringOrder += 1;
            }
        })

        //số lượng đơn hàng đã giao
        let completedOrder = 0;
        AllOrder.forEach(item => {
            if(item.situation == "Completed"){
                completedOrder += 1;
            }
        })

        //số lượng đơn hàng giao không thành công
        let failedOrder = 0;
        AllOrder.forEach(item => {
            if(item.situation == "Failed"){
                failedOrder += 1;
            }
        })


        //các sản phẩm bán nhiều nhất
        let highestSales = [];
        let tempHighestSales = production
        // Sắp xếp mảng production theo thứ tự từ lớn đến bé của (item.total_quantity - item.quantity)
        // tempHighestSales.sort((a, b) => (b.total_quantity - b.quantity) - (a.total_quantity - a.quantity));
        tempHighestSales.sort((a, b) => {
            const differenceA = a.total_quantity - a.quantity;
            const differenceB = b.total_quantity - b.quantity;
          
            // So sánh differenceA và differenceB
            if (differenceA !== differenceB) {
              return differenceB - differenceA; // Sắp xếp từ lớn đến bé của (total_quantity - quantity)
            } else {
              return b.profitPerProduct - a.profitPerProduct; // Sắp xếp từ lớn đến bé của profitPerProduct
            }
          });
        // Sắp xếp mảng production theo thứ tự từ bé đến lớn của (item.total_quantity - item.quantity)
        // tempHighestSales.sort((a, b) => (a.total_quantity - a.quantity) - (b.total_quantity - b.quantity));

        // Push các item vào highestSales theo thứ tự từ lớn đến bé của (total_quantity - quantity)
        tempHighestSales.forEach(item => {
            highestSales.push(item);
        });
        // console.log("highestSales: ", highestSales)


        //Người dùng có tổng giá trị các đơn hàng cao nhất
        let tempHighestSalesOfUsers = [];
        completedSale.forEach(item => {
            if (!_.isEmpty(item)) {
                tempHighestSalesOfUsers.push(JSON.parse(JSON.stringify(item)));
            }
          });
          
        let CountSalesOfUsers = [];
        tempHighestSalesOfUsers.forEach((itemA, indexA) => {
            let count = 1;
            let totalAmountOfUser = itemA.totalAmount;
            tempHighestSalesOfUsers.forEach((itemB, indexB) => {
                if( itemA.userInfor?.[0]?.firstName?.toLowerCase() === itemB.userInfor?.[0]?.firstName?.toLowerCase() && itemA.userInfor?.[0]?.email?.toLowerCase() === itemB.userInfor?.[0]?.email?.toLowerCase()){
                    if(indexA != indexB){
                        count++;
                    totalAmountOfUser += itemB.totalAmount;
                    }
                    tempHighestSalesOfUsers[indexB] = {};
                }
            })
            
            if(!_.isEmpty(itemA)){
                itemA.order_quantity = count;
                itemA.totalAmount = totalAmountOfUser;
                CountSalesOfUsers.push(itemA);
            }
        })
        console.log("CountSalesOfUsers: ", CountSalesOfUsers)
        let HighestSalesOfUsers = [];
        CountSalesOfUsers.sort((a, b) => {
            if (a.totalAmount !== b.totalAmount) {
              return b.totalAmount - a.totalAmount; // Sắp xếp từ lớn đến bé của (total_quantity - quantity)
            } else {
              return b.order_quantity - a.order_quantity; // Sắp xếp từ lớn đến bé của profitPerProduct
            }
          });
          CountSalesOfUsers.forEach((itemA, indexA) => {
            CountSalesOfUsers.forEach((itemB, indexB) => {
                if( itemA.userInfor?.[0]?.firstName?.toLowerCase() === itemB.userInfor?.[0]?.firstName?.toLowerCase() && itemA.userInfor?.[0]?.email?.toLowerCase() === itemB.userInfor?.[0]?.email?.toLowerCase()){
                    if(itemA.totalAmount > itemB.totalAmount){
                        CountSalesOfUsers[indexB] = {};
                    }
                }
            })
        })
          
          CountSalesOfUsers.forEach(item => {
            if(!_.isEmpty(item)){
                HighestSalesOfUsers.push(item);
            }
          });

        // console.log("HighestSalesOfUsers: ", HighestSalesOfUsers)

        //sort
        if (req.query.hasOwnProperty('_sort')) {
            const { column, type } = req.query;
            if(column == 'totalAmount' || column == 'createdAt'){
                console.log("bbbbbbbbbbbbbbbbbb")
                completedSale.sort((a, b) => {
              if (type === 'asc') {
                if (a[column] < b[column]) return -1;
                if (a[column] > b[column]) return 1;
                return 0;
              } else if (type === 'desc') {
                if (a[column] > b[column]) return -1;
                if (a[column] < b[column]) return 1;
                return 0;
              }
            });
            }
            totalimportMoneyPerP.sort((a,b) => {
                if (type === 'asc') {
                    if (a["total"] < b["total"]) return -1;
                    if (a["total"] > b["total"]) return 1;
                    return 0;
                  } else if (type === 'desc') {
                    if (a["total"] > b["total"]) return -1;
                    if (a["total"] < b["total"]) return 1;
                    return 0;
                  }
            })
            production.sort((a, b) => {
                if (a['profitPerProduct'] === b['profitPerProduct']) {
                    // Nếu giá trị "Tiền lời trên mỗi sản phẩm" bằng nhau, sắp xếp theo "Số lượng" giảm dần
                    if (a['total_quantity'] < b['total_quantity']) return 1;
                    if (a['total_quantity'] > b['total_quantity']) return -1;
                    return 0;
                }
                if (a['total_quantity'] === b['total_quantity']) {
                    // Nếu giá trị "Tiền lời trên mỗi sản phẩm" bằng nhau, sắp xếp theo "Số lượng" giảm dần
                    if (a['profitPerProduct'] < b['profitPerProduct']) return 1;
                    if (a['profitPerProduct'] > b['profitPerProduct']) return -1;
                    return 0;
                }
                if (type === 'asc') {
                  if (a[column] < b[column]) return -1;
                  if (a[column] > b[column]) return 1;
                  return 0;
                } else if (type === 'desc') {
                  if (a[column] > b[column]) return -1;
                  if (a[column] < b[column]) return 1;
                  return 0;
                }
              });
          }
          
        

        res.render("adminStatistic/statistic", { toDaySale , totalSale, importMoney, profitMoney, AllOrder, timeEachOrder,
            production, completedSale, preparingOrder, deliveringOrder, completedOrder, failedOrder, highestSales, HighestSalesOfUsers, totalimportMoneyPerP})
    }

    async statisticOption(req, res, next) {
        let date = req.body.date;
        let month = req.body.month;
        let year = req.body.year;
        console.log("year: ", year)
        let AllOrder = [];
        let order = await Order.find().lean()
        if(date){
            let total = 0;
            const parts = date.split('/');
            const reversedDateString = parts[2] + '-' + parts[1] + '-' + parts[0];
            order.forEach(item => {
                if(item.situation == "Completed"){
                    if(reversedDateString == item.createdAt.toISOString().slice(0, 10)){
                        AllOrder.push(item);
                        total += item.totalAmount;
                    }
                }
            })
            return res.render("adminStatistic/statisticOption", {AllOrder, date, total});
        }
        else if(month){
            let total = 0;
            const parts = month.split('/');
            const reversedMonthString = parts[1] + '-' + parts[0] ;
            // console.log('reversedMonthString: ', reversedMonthString)
            order.forEach(item => {
                // console.log(item.createdAt.toISOString().slice(0, 7))
                if(item.situation == "Completed"){
                    if(reversedMonthString == item.createdAt.toISOString().slice(0, 7)){
                        AllOrder.push(item);
                        total += item.totalAmount;
                    }
                }
            })
            return res.render("adminStatistic/statisticOption", {AllOrder, month, total});
        }
        else if(year){
            let total = 0;
            order.forEach(item => {
                if(item.situation == "Completed"){
                    if(year == item.createdAt.toISOString().slice(0, 4)){
                        AllOrder.push(item);
                        total += item.totalAmount;
                    }
                }
            })
            return res.render("adminStatistic/statisticOption", {AllOrder, year, total});
        }
    }

    async importMoneyOption(req, res, next){
        let type = req.body.importMoneyOption;
        Production.find({ type: { $regex: type, $options: "i" } }).lean()
            .then(production => {
                let total = 0;
                production.forEach(item => {
                    total += (item.total_quantity * item.original_prices);
                })
                console.log(total)
                return res.render("adminStatistic/importMoneyOption", {production, type, total})
            })
            
    }

    async preparingOrder(req, res, next){
        let order = await Order.find().lean()
        let ItemStatus = []
        order.forEach(item => {
            if(item.situation == "Preparing"){
                ItemStatus.push(item)
            }
        })
        return res.render("adminStatistic/orderStatus", {ItemStatus, preparingStatus : "Đang chuẩn bị hàng"})
    }

    async deliveringOrder(req, res, next){
        let order = await Order.find().lean()
        let ItemStatus = []
        order.forEach(item => {
            if(item.situation == "Delivering"){
                ItemStatus.push(item)
            }
        })
        return res.render("adminStatistic/orderStatus", {ItemStatus, deliveringStatus : "Đang giao hàng"})
    }

    async completedOrder(req, res, next){
        let order = await Order.find().lean()
        let ItemStatus = []
        order.forEach(item => {
            if(item.situation == "Completed"){
                ItemStatus.push(item)
            }
        })
        return res.render("adminStatistic/orderStatus", {ItemStatus, completedStatus : "Đã giao thành công"})
    }

    async failedOrder(req, res, next){
        let order = await Order.find().lean()
        let ItemStatus = []
        order.forEach(item => {
            if(item.situation == "Failed"){
                ItemStatus.push(item)
            }
        })
        return res.render("adminStatistic/orderStatus", {ItemStatus, failedStatus : "Giao hàng không thành công"})
    }

    async highestSalesOfType(req, res, next){
        let tempHighestSales = await Production.find().lean()
        let highestSalesOfType = [];
        let type = req.body.highestSalesOfType;
        let total = 0;
        // console.log(type)
        tempHighestSales.sort((a, b) => {
            const differenceA = a.total_quantity - a.quantity;
            const differenceB = b.total_quantity - b.quantity;
          
            // So sánh differenceA và differenceB
            if (differenceA !== differenceB) {
              return differenceB - differenceA; // Sắp xếp từ lớn đến bé của (total_quantity - quantity)
            } else {
              return b.profitPerProduct - a.profitPerProduct; // Sắp xếp từ lớn đến bé của profitPerProduct
            }
          });
        tempHighestSales.forEach(item => {
            if(item.type == type){
                highestSalesOfType.push(item);
                total += item.total;
            }
        });
        return res.render("adminStatistic/highestSalesOfType", {highestSalesOfType, type, total});
    }
}

module.exports = new adminController();
