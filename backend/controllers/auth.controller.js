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
export const profileDetails = async (req, res) => {
    try {
        console.log("Incoming query parameters:", req.query);

        const { mail } = req.query; 
        console.log(`Received mail: ${mail}`); 

        if (!mail) {
            return res.status(400).json({ error: "Mail parameter is missing" });
        }

        const user = await User.findOne({ mail });
        console.log(`Found user: ${user}`); 

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            mail: user.mail,
            walletAddress: user.walletAddress,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server error" });
    }
};  