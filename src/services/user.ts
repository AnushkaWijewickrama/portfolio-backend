const User = require('../models/user');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const getUsers = async () => {
    return await User.find();
};
export const deleteUser = async (id: string) => {
    await User.deleteMany({ _id: id });
    return await User.find(); // Return the updated list of users
};
export const registerUser = async (username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
};
export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Authentication failed');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Authentication failed');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    return token;
};

