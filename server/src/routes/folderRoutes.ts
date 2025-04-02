import express from 'express';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../controllers/folderController';

const router = express.Router();

router.route('/')
  .get(getFolders)
  .post(createFolder);

router.route('/:id')
    .put(updateFolder)
    .delete(deleteFolder);


export default router;