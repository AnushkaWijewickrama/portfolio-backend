import { Request, Response } from 'express';
import { getUsers, deleteUser, registerUser, loginUser } from '../services/user';

export const getUser = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Fetching users failed.' });
    }
};
export const deleteUserHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const updatedUsers = await deleteUser(id);
        res.status(200).json(updatedUsers);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Deleting user failed.' });
    }
};
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        await registerUser(username, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const token = await loginUser(username, password);
        res.status(200).json({ token });
    } catch (error: any) {
        if (error.message === 'Authentication failed') {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};