const Product = require("../model/Production");
const Cart = require("../model/Cart");
const User = require("../model/Login");
const Order = require("../model/Order");
const mongoose = require("mongoose");
const Production = require("../model/Production");
const { ObjectId } = require('mongoose');

class CartController {
    index(req, res, next) {
        let totalAmount;
        let userId = req.session.userId;
        let cartUser = [];
        Cart.findOne({ userId })
            .lean()
            .then((cart) => {
                if (cart) {
                    totalAmount = cart.totalAmount;
                    if (totalAmount == 0) {
                        if (cart.items.length > 0) {
                            cart.items.forEach((item) => {
                                cartUser.push(item);
                                totalAmount += item.total_price;
                            });
                        }
                    } else {
                        if (cart.items.length > 0) {
                            cart.items.forEach((item) => {
                                cartUser.push(item);
                            });
                        }
                    }
                }
                // console.log('totalAmount: ', totalAmount)
                // console.log('cartUser: ', cartUser)
                res.render("cart", { cartUser, totalAmount });
            })
            .catch((error) => {
                console.log(error);
                next(error);
            });
    }

    async addToCart(req, res, next) {
        try {
            let productId = req.body.id;
            let userId = req.session.userId;
            let product = await Product.findById(productId);

            if (!product) {
                throw { status: 404, message: "Sản phẩm không tồn tại" };
            }

            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = new Cart();
                cart.userId = userId;
                cart.items = [];
                cart.totalAmount = 0;
            }
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            let existingItem = cart.items.find(
                (item) => item.product == product.id && item.userId == userId
            );
            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1, và cộng tổng số tiền
                existingItem.quantity += 1;
                existingItem.total_price =
                    existingItem.price * existingItem.quantity;
                cart.totalAmount += existingItem.price;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào giỏ hàng

                let newItem = {
                    product: product.id,
                    name: product.name,
                    image: product.image[0],
                    price: product.new_prices,
                    total_price: product.new_prices,
                    quantity: 1,
                    quantityProduct: product.quantity,
                    userId: userId || undefined,
                };
                cart.items.push(newItem);
                cart.totalAmount += product.new_prices;
            }
            await cart.save();
            return res.redirect("/cart");
        } catch (error) {
            res.status(error.status || 500).json({
                message: error.message || "Đã xảy ra lỗi",
            });
        }
    }

    async updateCartQuantity(req, res, next) {
        let userId = req.params.id;
        let new_quantity = req.body.quantity;
        console.log("new_quantity: ", new_quantity);
        let productId = req.body.productId;
        console.log("productId: ", productId);
        console.log("productId: ", typeof productId);

        let totalAmount = 0;
        let cartUser = [];
        let totalprice = 0;
        let cart = await Cart.findOne({ userId }).lean();
        // console.log("cartttttttt: ", cart)
        if (!cart) {
            throw new Error("Không tìm thấy giỏ hàng");
        }
        if (cart.items.length > 0) {
            if (typeof productId == "string") {
                console.log("aaaaaaaaaaaaaaaaa");
                for (let i = 0; i < cart.items.length; i++) {
                    if (cart.items[i].product.equals(productId)) {
                        cart.items[i].quantity = new_quantity;
                        cart.items[i].total_price =
                            new_quantity * cart.items[i].price;
                        totalprice += new_quantity * cart.items[i].price;
                        cartUser.push(cart.items[i]);
                    }
                }
            } else {
                for (let i = 0; i < cart.items.length; i++) {
                    if (cart.items[i].product.equals(productId[i])) {
                        cart.items[i].quantity = new_quantity[i];
                        cart.items[i].total_price =
                            new_quantity[i] * cart.items[i].price;
                        totalprice += new_quantity[i] * cart.items[i].price;
                        cartUser.push(cart.items[i]);
                    }
                }
            }
        }
        // console.log("cartUser: ", cartUser);
        cart.totalAmount = totalprice;
        totalAmount = totalprice;
        await Cart.findOneAndUpdate(
            { userId },
            { items: cart.items, totalAmount: totalprice }
        );
        res.render("cart", { cartUser, totalAmount });
        return setTimeout(() => {
            res.redirect("/cart");
        });
    }

    async updateCartQuantity_guest(req, res, next) {
        let userId = req.params.id;
        let new_quantity = req.body.quantity;
        console.log("new_quantity: ", new_quantity);
        let productId = req.body.productId;
        console.log("productId: ", productId);
        console.log("productId: ", typeof productId);

        let totalAmount = 0;
        let cartUser = [];
        let totalprice = 0;
        let cart = await Cart.findOne({ userId }).lean();
        // console.log("cartttttttt: ", cart)
        if (!cart) {
            throw new Error("Không tìm thấy giỏ hàng");
        }
        if (cart.items.length > 0) {
            if (typeof productId == "string") {
                console.log("aaaaaaaaaaaaaaaaa");
                for (let i = 0; i < cart.items.length; i++) {
                    if (cart.items[i].product.equals(productId)) {
                        cart.items[i].quantity = new_quantity;
                        cart.items[i].total_price =
                            new_quantity * cart.items[i].price;
                        totalprice += new_quantity * cart.items[i].price;
                        cartUser.push(cart.items[i]);
                    }
                }
            } else {
                for (let i = 0; i < cart.items.length; i++) {
                    if (cart.items[i].product.equals(productId[i])) {
                        cart.items[i].quantity = new_quantity[i];
                        cart.items[i].total_price =
                            new_quantity[i] * cart.items[i].price;
                        totalprice += new_quantity[i] * cart.items[i].price;
                        cartUser.push(cart.items[i]);
                    }
                }
            }
        }
        // console.log("cartUser: ", cartUser);
        cart.totalAmount = totalprice;
        totalAmount = totalprice;
        await Cart.findOneAndUpdate(
            { userId },
            { items: cart.items, totalAmount: totalprice }
        );
        res.render("cart", { cartUser, totalAmount });
        return setTimeout(() => {
            res.redirect("/cart");
        });
    }

    // [DELETE] /cart/:Id
    delete(req, res, next) {
        const productId = req.params.id; // Sử dụng req.params.id thay vì req.body.id
        const userId = req.session.userId;
        Cart.findOne({ userId })
            .then((cart) => {
                if (!cart) {
                    throw new Error("Giỏ hàng không tồn tại");
                }
                console.log("cartdelete: ", cart);
                const itemIndex = cart.items.findIndex((item) =>
                    item.product.equals(productId)
                );
                if (itemIndex !== -1) {
                    cart.items.splice(itemIndex, 1); // Xóa phần tử tại vị trí itemIndex
                    if (cart.items.length === 0) {
                        return Cart.deleteOne({ _id: cart._id }); // Xóa giỏ hàng nếu không còn phần tử
                    } else {
                        return cart.save();
                    }
                }
            })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    checkout(req, res, next) {
        let totalAmount = 0;
        const userId = req.session.userId;
        const cartUser = [];
        const userInfor = [];
        let productId = req.body.id;
        req.session.productId2 = productId;
        productId = productId.split(",");
        req.session.productId = productId;
        // console.log('productId: ', productId)
        Cart.find()
            .lean()
            .then(async (cart) => {
                const userPromise = User.findOne({ _id: userId }).lean();

                cart.forEach((item) => {
                    if (item.userId == userId) {
                        for (var i = 0; i < item.items.length; i++) {
                            for (var j = 0; j < productId.length - 1; j++) {
                                if (item.items[i].product == productId[j]) {
                                    totalAmount += item.items[i].total_price;
                                    cartUser.push(item.items[i]);
                                }
                            }
                        }
                    }
                });

                return Promise.all([userPromise, cartUser]);
            })
            .then(([user, cartUser]) => {
                if (user) {
                    userInfor.push(user); // Lưu thông tin người dùng vào userInfor
                }

                res.render("checkout", { cartUser, totalAmount, userInfor });
            })
            .catch((error) => {
                console.log(error);
                next(error);
            });
    }

    forceDeleteOrder(res, req, next) {
        Order.deleteOne({ _id: req.params.orderId })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    async order(req, res, next) {
        try {
            let totalAmount = 0;
            const userId = req.session.userId;
            const cartUser2 = [];
            const userInfor = [];
            let productId = req.session.productId;
            const cart = await Cart.find({ userId }).lean();
            const userPromise = User.findOne({ _id: userId }).lean();

            // ---------
            // Production.forEach((item) => {
            //     for (var i = 0; i < productId.length; i++) {
            //         if (item._id == productId) {
            //             inOrder: false;
            //         }
            //     }
            // });
            // const productId = req.session.productId;

            // productId.forEach(async (productId) => {
            //     await Production.findOneAndUpdate(
            //         { _id: productId },
            //         { inOrder: true }
            //     );
            // });

            // Xác định mảng _id của các sản phẩm trong productId
           
            // Cập nhật trạng thái inOrder của các sản phẩm
            cart.forEach((item) => {
                if (item.userId == userId) {
                    for (var i = 0; i < item.items.length; i++) {
                        for (var j = 0; j < productId.length - 1; j++) {
                            if (item.items[i].product == productId[j]) {
                                totalAmount += item.items[i].total_price;
                                cartUser2.push(item.items[i]);
                            }
                        }
                    }
                }
            });

            const [user, cartUser] = await Promise.all([
                userPromise,
                cartUser2,
            ]);

            if (user || cartUser.length > 0) {
                userInfor.push({
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    firstName: req.body.firstName,
                });

                const order = new Order({
                    userInfor: userInfor,
                    items: cartUser.map((cartItem) => ({
                        product: cartItem.product,
                        name: cartItem.name,
                        image: cartItem.image,
                        price: cartItem.price,
                        total_price: cartItem.total_price,
                        quantity: cartItem.quantity,
                    })),
                    totalAmount: totalAmount,
                    userId: userId,
                    situation: "Preparing",
                });

                await order.save();
                // Cập nhật lại số lượng sản phẩm trong kho
                for (const cartItem of cartUser) {
                    await Product.findOneAndUpdate(
                        { _id: cartItem.product },
                        { $inc: { quantity: -cartItem.quantity } }
                    );
                }
                // Xóa giỏ hàng sau khi tạo đơn hàng
                const ObjectId = mongoose.Types.ObjectId;
                const productIds = productId
                    .filter((id) => id.trim() !== "") // Loại bỏ các giá trị rỗng
                    .map((id) => new ObjectId(id)); // Chuyển đổi thành đối tượng ObjectId

                await Cart.findOneAndUpdate(
                    { userId },
                    { $pull: { items: { product: { $in: productIds } } } },
                    { new: true }
                );
                await Production.updateMany(
                    { _id: { $in: productIds } },
                    { $set: { inOrder: true } }
                );
                res.render("order", {
                    cartUser: cartUser2,
                    totalAmount,
                    userInfor,
                });
            } else {
                res.redirect("/cart");
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                Order.delete({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                // res.json(req.body);
                break;
            case "restore":
                Order.restore({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("/admin/stored/order"))
                    .catch(next);
                break;
            case "forceDelete":
                Order.deleteMany({ _id: { $in: req.body.productionIds } })
                    .then(() => res.redirect("back"))
                    .catch(next);
                // res.json(req.body);
                break;
            default:
                // res.json({ message: "Action is invalid" });
                res.render("error", { error: "Action is invalid" });
        }
    }
}

module.exports = new CartController();
