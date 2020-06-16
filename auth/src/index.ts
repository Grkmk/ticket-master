import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY not found');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not found');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to mongoDB');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => console.log('Server running at port 3000!'));

start();
