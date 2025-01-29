import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string; // Add the userId property to the Request interface
        }
    }
}
