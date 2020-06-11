import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  [body('email').isEmail(), body('password').isLength({ min: 4, max: 12 })],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    const { email, password } = req.body;
    console.log('creating user');
    res.send({});
  }
);

export { router as signupRouter };
