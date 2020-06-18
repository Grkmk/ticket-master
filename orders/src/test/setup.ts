import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { TicketDoc, Ticket } from '../models/ticket';
import { OrderDoc, Order, OrderStatus } from '../models/order';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
      createId(): string;
      createTicket(): Promise<TicketDoc>;
      createOrder(ticket: TicketDoc): Promise<OrderDoc>;
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
    const ticket = Ticket.build({ title: 'concert', price: 1 });
    try {
      await ticket.save();
    } catch (err) {
      reject(err);
    }
    resolve(ticket);
  });
};

global.createOrder = (ticket: TicketDoc) => {
  return new Promise<OrderDoc>(async (resolve, reject) => {
    const order = Order.build({
      ticket: ticket,
      userId: 'ashadfh',
      status: OrderStatus.Created,
      expiresAt: new Date()
    });
    try {
      await order.save();
    } catch (err) {
      reject(err);
    }
    resolve(order);
  });
};

global.createId = () => new mongoose.Types.ObjectId().toHexString();
