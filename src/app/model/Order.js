const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            unique: true,
            default: () => {
                let id = "";
                const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                const length = 15;
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(
                        Math.random() * characters.length
                    );
                    id += characters[randomIndex];
                }
                return id;
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        userInfor: [
            {
                email: { type: String, min: 1000 },
                phone: { type: String, min: 1000 },
                address: { type: String, min: 1000 },
                firstName: { type: String, maxLength: 100 },
            },
        ],
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                total_price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    // tyrequired: true,
                },
            },
        ],
        totalAmount: { type: Number },
        reasonCancel:{type: String},
        createdAt: {
            type: Date,
            default: Date.now
          },
        situation:{
            type: String,
            requre: true,
        }
    },
    { versionKey: false }
);

orderSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidtype = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidtype ? req.query.type : "desc",
        });
    }
    return this;
};

orderSchema.plugin(mongooseDelete, {
    overrideMethods: "all",
    deletedAt: true,
});

module.exports = mongoose.model("Order", orderSchema);
