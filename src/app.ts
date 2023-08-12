import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import emailRouter from './routes/emailRoutes';

// Environment variables
dotenv.config({ path: '.env' });

// DB connection
mongoose
  .connect(process.env.DB_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((): void => console.log('Database connected'))
  .catch((err: Error): void => console.log(err));

// App
const app: Application = express();

app.use(bodyParser.json());

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/api/v1/emails", emailRouter);

app.listen(PORT, (): void => {
  console.log('SERVER IS UP ON PORT:', PORT);
});
