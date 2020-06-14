import request from 'supertest';
import { app } from '../../app';

it("fails with an email that doesn't exist", async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('fails with an incorrect password', async () => {
  await global.signup();
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'passwo' })
    .expect(400);
});

it('sets a cookie after successful signin', async () => {
  await global.signup();
  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
