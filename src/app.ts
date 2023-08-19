import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';

// Environment variables
dotenv.config({ path: '.env' });

// DB connection
console.log('a');
mongoose
  .connect(
    process.env.DB_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then((): void => console.log('Database connected'))
  .catch((err: Error): void => console.log(err));

// App
const app = express();

app.use(bodyParser.json());

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

//app.use('/api/v1/emails', emailRouter);
app.use('/api/v1/auth', authRouter);

app.listen(PORT, (): void => {
  console.log('SERVER IS UP ON PORT:', PORT);
});
