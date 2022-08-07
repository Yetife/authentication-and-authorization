const mongoose = require('mongoose');
const { Schema } = mongoose

const UserSchema = new Schema(
    {
        //Define the properties of the application user
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            require: true
        },
        userName: {
            type: String,
            require: true,
            unique: true,
            lowerCase: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String
        },
        userRole: {
            type: String,
            enum: ["admin", "staff", "manager", "not assigned"],
            default: "not assigned"
        },
        isStaff: {
            type: Boolean,
            default: 0
        },
        isAdmin: {
            type: Boolean,
            default: 0
        },
        isManager: {
            type: Boolean,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", UserSchema);