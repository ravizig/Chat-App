import { bcryptjs } from '../config/constants.js ';

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcryptjs.compare(password, hashedPassword);
  return isMatch;
};

export default comparePassword;
