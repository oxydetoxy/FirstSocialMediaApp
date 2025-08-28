const mongoose = require("mongoose");

const userSchemaSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter a name"],
    },
    avatar:{
        public_id: String,
        url: String,
    },
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exists"],
    },
    password:{
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);
