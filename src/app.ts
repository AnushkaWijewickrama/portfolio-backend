import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
const swaggerDocs = require("../swagger-output.json");
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
// Serve Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', userRoutes);
app.use('/api', projectRoutes);

// Routes
app.get("/", (req: Request, res: Response): any => {
  return res.send('Anushka Wijewickrama');
});

// Export the app for testing or other purposes
module.exports = app;
