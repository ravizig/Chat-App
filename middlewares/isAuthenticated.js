import { messages, ResponseCodes } from '../config/constants.js';

const isAuthenticated = async (req, res, proceed) => {
  try {
    if (req.isAuthenticated) {
      console.log('req.isAuthenticated: ', req.isAuthenticated);
      return proceed();
    }
    return res.status(ResponseCodes.FORBIDDEN).send({
      status: ResponseCodes.FORBIDDEN,
      message: messages.INVALID_TOKEN,
      data: {},
    });
  } catch (error) {
    return res.status(ResponseCodes.SERVER_ERROR).send({
      status: ResponseCodes.SERVER_ERROR,
      message: error.message,
      data: {},
    });
  }
};

export default isAuthenticated;
