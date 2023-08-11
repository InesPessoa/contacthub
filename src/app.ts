import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Environment variables
dotenv.config({ path: '.env' });

// DB connection
mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/contacthub`
  )
  .then((): void => console.log('Database connected'))
  .catch((err: Error): void => console.log(err));

// App
const app: Application = express();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use('/', (req: Request, res: Response): void => {
  res.send('Hello world!');
});

app.listen(PORT, (): void => {
  console.log('SERVER IS UP ON PORT:', PORT);
});
