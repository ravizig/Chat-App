import { express } from '../config/constants.js';
import {
  userSignUp,
  userLogin,
  userLogout,
} from '../controllers/AuthController.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isUser from '../middlewares/isUser.js';

const router = express.Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/logout', isAdmin, isUser, isAuthenticated, userLogout);

export default router;
