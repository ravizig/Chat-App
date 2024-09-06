import { ResponseCodes, EventCodes, messages } from '../config/constants.js';
import comparePassword from '../helpers/comparePassword.js';
import encryptPassword from '../helpers/encyptyPassword.js';
import generateToken from '../helpers/generateToken.js';
import { User, validateData } from '../models/User.js';

const userSignUp = async (req, res) => {
  try {
    let userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      userProfile: req.body.userProfile,
      eventCode: EventCodes.USER_SIGNUP,
    };

    const result = await validateData(userData);
    if (result.hasError) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: Object.keys(result.errors).length + ' error(s) found.',
        error: result.errors,
        data: {},
      });
    }

    // Delete eventCode from userData
    delete userData.eventCode;

    let exitingUser = await User.findOne({ email: userData.email });

    if (exitingUser) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.USER_EXISTS,
        data: {},
      });
    }

    userData.password = decodeURIComponent(userData.password);

    userData.password = await encryptPassword(userData.password);

    let createdUser = await User.create(userData);

    return res.status(ResponseCodes.OK).send({
      status: ResponseCodes.OK,
      message: messages.USER_REGISTERED,
      data: createdUser,
    });
  } catch (error) {
    return res.status(ResponseCodes.SERVER_ERROR).send({
      status: ResponseCodes.SERVER_ERROR,
      message: error.message,
      data: {},
    });
  }
};

const userLogin = async (req, res) => {
  try {
    let userData = {
      email: req.body.email,
      password: req.body.password,
      eventCode: EventCodes.USER_LOGIN,
    };
    const result = await validateData(userData);

    if (result.hasError) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: Object.keys(result.errors).length + ' error(s) found.',
        error: result.errors,
        data: {},
      });
    }

    // Delete eventCode from userData
    delete userData.eventCode;

    let exitingUser = await User.findOne({ email: userData.email });
    if (!exitingUser) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.USER_NOT_FOUND,
        data: {},
      });
    }

    userData.password = decodeURIComponent(userData.password);

    let isPasswordMatch = await comparePassword(
      userData.password,
      exitingUser.password
    );

    if (!isPasswordMatch) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.INVALID_PASSWORD,
        data: {},
      });
    }

    let token = await generateToken({
      id: exitingUser._id,
      email: exitingUser.email,
      name: exitingUser.name,
      role: exitingUser.role,
    });

    await User.updateOne(
      { _id: exitingUser._id },
      { $set: { token: token } },
      { new: true }
    );

    return res.status(ResponseCodes.OK).send({
      status: ResponseCodes.OK,
      message: messages.USER_LOGIN,
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

const userLogout = async (req, res) => {
  try {
    let id = req.headers.userData ? req.headers.userData.id : req.body.id;

    await User.updateOne({ id }).set({
      token: '',
    });

    return res.status(ResponseCodes.OK).send({
      status: ResponseCodes.OK,
      message: messages.USER_LOGOUT,
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

export { userSignUp, userLogin, userLogout };
