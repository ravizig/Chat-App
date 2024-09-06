import { express } from '../config/constants.js';
import { changePassword, updateUser } from '../controllers/UserController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isUser from '../middlewares/isUser.js';

const router = express.Router();

router.post('/update-details', isUser, isAuthenticated, updateUser);
router.post('/change-password', isUser, isAuthenticated, changePassword);

export default router;
