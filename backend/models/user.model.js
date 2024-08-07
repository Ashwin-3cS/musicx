import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        mail: {
            type: String,
            required: true,
            unique: true,
        },
        walletAddress: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
