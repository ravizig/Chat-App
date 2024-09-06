import { express } from '../config/constants.js';
import authRoutes from '../routes/AuthRoutes.js';
import userRoutes from '../routes/userRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;
