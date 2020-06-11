import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('something');
});

app.listen(3000, () => console.log('Server running at port 3000!'));
