import { Request, Response, NextFunction } from 'express';
import Folder, { IFolder } from '../models/Folder';
import Prompt from '../models/Prompt'; // Import Prompt model

// @desc    Get all folders
// @route   GET /api/folders
// @access  Public
export const getFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const folders = await Folder.find().sort({ name: 1 });
    res.status(200).json(folders);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a folder
// @route   POST /api/folders
// @access  Public
export const createFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;
     if (!name) {
      res.status(400).json({ message: 'Folder name is required' });
      return;
    }
    const newFolder = new Folder({ name, description });
    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
     if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        res.status(409).json({ message: 'Folder with this name already exists' });
        return;
      }
    next(error);
  }
};

// @desc    Update a folder
// @route   PUT /api/folders/:id
// @access  Public
export const updateFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description } = req.body;
        const folder = await Folder.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!folder) {
            res.status(404).json({ message: 'Folder not found' });
            return;
        }
        res.status(200).json(folder);
    } catch (error) {
         if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            res.status(409).json({ message: 'Folder with this name already exists' });
            return;
        }
        next(error);
    }
};

// @desc    Delete a folder
// @route   DELETE /api/folders/:id
// @access  Public
export const deleteFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const folderId = req.params.id;
        const folder = await Folder.findById(folderId);

        if (!folder) {
            res.status(404).json({ message: 'Folder not found' });
            return;
        }

        // Option 1: Set folder field to null for prompts in this folder
        await Prompt.updateMany({ folder: folderId }, { $set: { folder: null } });

        // Option 2: Delete prompts within the folder (Use with caution!)
        // await Prompt.deleteMany({ folder: folderId });

        await Folder.findByIdAndDelete(folderId);

        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        next(error);
    }
};