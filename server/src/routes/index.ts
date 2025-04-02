import express from 'express';
import promptRoutes from './promptRoutes';
import folderRoutes from './folderRoutes';
import tagRoutes from './tagRoutes';

const router = express.Router();

router.use('/prompts', promptRoutes);
router.use('/folders', folderRoutes);
router.use('/tags', tagRoutes);

// Simple health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});


export default router;