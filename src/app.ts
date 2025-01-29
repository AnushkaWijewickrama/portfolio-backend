import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');

dotenv.config(); // Load environment variables

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// MongoDB connection
mongoose
  .connect(
    `${process.env.DATABASE}`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.error(`Could not connect to database server`, err));

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);


// Routes
app.get("/", (req: Request, res: Response): any => {
  return res.send('Anushka Wijewickrama');
});


// Export the app for testing or other purposes
export default app;
