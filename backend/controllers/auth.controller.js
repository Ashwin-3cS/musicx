import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const profile = async (req, res) => {
    try {
        const { userName, mail, walletAddress } = req.body;

        const user = await User.findOne({ userName });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({
            userName,
            mail,
            walletAddress,
        });

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            mail: newUser.mail,
            walletAddress: newUser.walletAddress,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server error" });
    }
};
