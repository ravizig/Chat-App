import { jwt, messages, ResponseCodes, Roles } from '../config/constants.js';
import { User } from '../models/User.js';

const isAdmin = async (req, res, proceed) => {
  try {
    let token = req.get('x-auth');

    if (req.isAuthenticated) {
      return proceed();
    }

    if (token) {
      let decodedToken = jwt.decode(token, process.env.JWT_SECRET);
      console.log('decodedToken: ', decodedToken);

      if (!decodedToken) {
        return res.status(ResponseCodes.FORBIDDEN).send({
          status: ResponseCodes.FORBIDDEN,
          message: messages.INVALID_TOKEN,
          data: {},
        });
      }

      let userData = await User.findOne({
        id: decodedToken._id,
        role: Roles.Admin,
        token: token,
      }).select('-password');

      if (userData) {
        req.userData = userData;
        req.isAuthenticated = true;
        return proceed();
      }

      req.isAuthenticated = false;
      return proceed();
    }

    req.isAuthenticated = false;

    return res.status(ResponseCodes.FORBIDDEN).send({
      status: ResponseCodes.FORBIDDEN,
      message: messages.INVALID_TOKEN,
      data: {},
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(ResponseCodes.SERVER_ERROR).send({
      status: ResponseCodes.SERVER_ERROR,
      message: error.message,
      data: {},
    });
  }
};

export default isAdmin;
