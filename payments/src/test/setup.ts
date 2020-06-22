import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { TicketDoc, Ticket } from '../models/ticket';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
      createId(): string;
      createTicket(): Promise<TicketDoc>;
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = () => {
  const payload = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`express:sess=${base64}`];
};

global.createTicket = () => {
  return new Promise<TicketDoc>(async (resolve, reject) => {
    const ticket = Ticket.build({
      userId: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 1
    });
    try {
      await ticket.save();
    } catch (err) {
      reject(err);
    }
    resolve(ticket);
  });
};

global.createId = () => new mongoose.Types.ObjectId().toHexString();
