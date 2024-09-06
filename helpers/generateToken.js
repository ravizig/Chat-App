import { jwt } from '../config/constants.js';

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return token;
};

export default generateToken;
