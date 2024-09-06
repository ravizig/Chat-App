import { bcryptjs } from '../config/constants.js';

const encryptPassword = async (password) => {
  const SaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  const salt = await bcryptjs.genSalt(SaltRounds);
  const hashedPassword = await bcryptjs.hash(password, salt);
  return hashedPassword;
};

export default encryptPassword;
