import { EventCodes, messages, ResponseCodes } from '../config/constants.js';
import comparePassword from '../helpers/comparePassword.js';
import { User, validateData } from '../models/User.js';

const updateUser = async (req, res) => {
  try {
    let userData = {
      id: req.headers.userData ? req.headers.userData.id : req.body.id,
      name: req.body.name,
      userProfile: req.body.userProfile,
    };

    let updatedUser = await User.updateOne({ id: userData.id }).set(userData);

    if (!updatedUser) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.USER_NOT_FOUND,
        data: {},
      });
    }

    return res.status(ResponseCodes.OK).send({
      status: ResponseCodes.OK,
      message: messages.USER_UPDATED,
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

const changePassword = async (req, res) => {
  try {
    let userData = {
      id: req.headers.userData ? req.headers.userData.id : req.body.id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmNewPassword: req.body.confirmNewPassword,
      evenCode: EventCodes.CHANGE_PASSWORD,
    };

    if (userData.newPassword !== userData.confirmNewPassword) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.PASSWORD_MISMATCH,
        data: {},
      });
    }

    let result = validateData(userData);
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

    // decode all passwords
    userData.oldPassword = decodeURIComponent(userData.oldPassword);
    userData.newPassword = decodeURIComponent(userData.newPassword);
    userData.confirmNewPassword = decodeURIComponent(
      userData.confirmNewPassword
    );

    let exitingUser = await User.findOne({ id: userData.id });

    if (!exitingUser) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.USER_NOT_FOUND,
        data: {},
      });
    }

    let isOldPasswordMatch = await comparePassword(
      userData.oldPassword,
      exitingUser.password
    );

    if (!isOldPasswordMatch) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.INVALID_PASSWORD,
        data: {},
      });
    }

    let isNewPasswordMatch = await comparePassword(
      userData.newPassword,
      exitingUser.password
    );

    if (isNewPasswordMatch) {
      return res.status(ResponseCodes.BAD_REQUEST).send({
        status: ResponseCodes.BAD_REQUEST,
        message: messages.DIFFERENT_PASSWORD,
        data: {},
      });
    }

    await User.updateOne({ id: userData.id }).set({
      password: userData.newPassword,
    });

    return res.status(ResponseCodes.OK).send({
      status: ResponseCodes.OK,
      message: messages.PASSWORD_CHANGED,
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

export { updateUser, changePassword };
