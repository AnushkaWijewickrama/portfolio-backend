import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: any, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(" ");

    if (!token || !token[1]) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token[1], process.env.JWT_SECRET as string) as { userId: string, exp: number };

        if (Date.now() >= decoded.exp * 1000) {
            return1 res.status(401).json({ error: 'Token expired' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
