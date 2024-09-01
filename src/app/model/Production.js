const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const slug = require("mongoose-slug-updater");

const Schema = mongoose.Schema;

const ProductionSchema = new Schema(
    {
        name: { type: String, maxLength: 255 },
        original_prices: { type: Number },
        old_prices: { type: Number },
        new_prices: { type: Number },
        profitPerProduct: { type: Number },
        image: { type: [String] },
        type: { type: String, maxLength: 500 },
        factory: { type: String, maxLength: 500 },
        ensure: { type: Number, minLength: 12 },
        deadline: { type: Date, default: Date.now },
        slug: { type: String, slug: "name" },
        quantity: { type: Number, min: 0 },
        total_quantity: { type: Number, min: 0 },
        inOrder: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

//Custom query helpers

ProductionSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidtype = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidtype ? req.query.type : "desc",
        });
    }
    return this;
};

mongoose.plugin(slug);
ProductionSchema.plugin(mongooseDelete, {
    overrideMethods: "all",
    deletedAt: true,
});

module.exports = mongoose.model("Production", ProductionSchema);
