const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const slug = require("mongoose-slug-updater");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: { type: String, maxLength: 255 },
        email: { type: String, min: 1000 },
        password: { type: String, min: 1000 },
        role: { type: String, min: 1000 },
        phone: { type: String, min: 1000 },
        address: { type: String, min: 1000 },
        firstName: {type: String, maxLength: 100},
    },
    {
        timestamps: true,
    }
);

UserSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidtype = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidtype ? req.query.type : "desc",
        });
    }
    return this;
};

mongoose.plugin(slug);
UserSchema.plugin(mongooseDelete, {
    overrideMethods: "all",
    deletedAt: true,
});

module.exports = mongoose.model("Account", UserSchema);
