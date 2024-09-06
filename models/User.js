import { mongoose, Validator, EventCodes, Roles } from '../config/constants.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userProfile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: Roles.User,
    in: [Roles.Admin, Roles.User],
  },
  token: {
    type: String,
    default: '',
  },
  // isOnline: {
  //   type: Boolean,
  //   default: false,
  // },
});

const User = mongoose.model('User', userSchema);

const validateData = (userdata) => {
  let data;
  let rules;
  let result = {};
  switch (userdata.eventCode) {
    case EventCodes.USER_SIGNUP:
      data = {
        name: userdata.name,
        email: userdata.email,
        password: userdata.password,
        userProfile: userdata.userProfile,
      };

      rules = {
        name: 'required|string',
        email: 'required|email',
        password: 'required|string|min:8',
        userProfile: 'required|string',
      };
      break;

    case EventCodes.USER_SIGNUP:
      data = {
        email: userdata.email,
        password: userdata.password,
      };

      rules = {
        email: 'required|email',
        password: 'required|string',
      };
      break;
    case EventCodes.CHANGE_PASSWORD:
      data = {
        password: userdata.password,
        newPassword: userdata.newPassword,
        confirmNewPassword: userdata.confirmNewPassword,
      };

      rules = {
        password: 'required|string',
        newPassword: 'required|string|min:8',
        confirmNewPassword: 'required|string|min:8',
      };
      break;
  }

  const validation = new Validator(data, rules);

  if (validation.passes()) {
    result['hasError'] = false;
  }
  if (validation.fails()) {
    result['hasError'] = true;
    result['errors'] = validation.errors.all();
  }
  return result;
};

export { User, validateData };
