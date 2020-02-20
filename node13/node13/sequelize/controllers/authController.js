import jwt from 'jsonwebtoken';
import { SECRET } from '../constants/secret';
import { INTERNAL_SERVER_ERROR } from 'http-status';


export const login = async (req, res) => {
  const { user } = req;
  try {
    const { id } = user;

    const token = jwt.sign({ id }, SECRET);

    return res.json(
      {
        data: {
          jwt: token,
          user,
        },
        message: 'Login user',
      },
    );
  } catch (error) {
    console.error(error);

    return res.status(INTERNAL_SERVER_ERROR).json({
      message: error,
      statusCode: INTERNAL_SERVER_ERROR,
      success: false
    });
  }
};