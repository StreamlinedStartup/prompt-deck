import { Request, Response, NextFunction } from 'express';
import Prompt, { IPrompt } from '../models/Prompt';
import mongoose from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all prompts (with optional filtering by folder/tag)
// @route   GET /api/prompts
// @access  Public
export const getPrompts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { folderId, tagId, search } = req.query;
    let query: mongoose.FilterQuery<IPrompt> = {};

    if (folderId && typeof folderId === 'string' && isValidObjectId(folderId)) {
      query.folder = folderId;
    } else if (folderId === 'uncategorized') {
        query.folder = null; // Find prompts with no folder
    }

    if (tagId && typeof tagId === 'string' && isValidObjectId(tagId)) {
      query.tags = tagId; // Find prompts containing this tagId
    }

    if (search && typeof search === 'string') {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        query.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { content: searchRegex }
        ];
    }


    const prompts = await Prompt.find(query)
                                .populate('tags', 'name color') // Populate tag names and colors
                                .populate('folder', 'name') // Populate folder name
                                .sort({ updatedAt: -1 }); // Sort by most recently updated
    res.status(200).json(prompts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single prompt by ID
// @route   GET /api/prompts/:id
// @access  Public
export const getPromptById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
     if (!isValidObjectId(req.params.id)) {
        res.status(400).json({ message: 'Invalid Prompt ID format' });
        return;
    }
    const prompt = await Prompt.findById(req.params.id)
                               .populate('tags', 'name color _id') // Populate full tag objects for editing
                               .populate('folder', 'name _id'); // Populate folder object

    if (!prompt) {
      res.status(404).json({ message: 'Prompt not found' });
      return;
    }
    res.status(200).json(prompt);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new prompt
// @route   POST /api/prompts
// @access  Public
export const createPrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, description, tags, folder } = req.body;

    if (!title || !content) {
        res.status(400).json({ message: 'Title and Content are required' });
        return;
    }

    // Validate tag IDs if provided
    if (tags && Array.isArray(tags)) {
        for (const tagId of tags) {
            if (!isValidObjectId(tagId)) {
                res.status(400).json({ message: `Invalid Tag ID format: ${tagId}` });
                return;
            }
        }
    }
     // Validate folder ID if provided
    if (folder && !isValidObjectId(folder)) {
        res.status(400).json({ message: 'Invalid Folder ID format' });
        return;
    }


    const newPrompt = new Prompt({
      title,
      content,
      description,
      tags: tags || [], // Ensure tags is an array
      folder: folder || null, // Allow null folder
    });

    const savedPrompt = await newPrompt.save();
    // Populate references before sending response
    const populatedPrompt = await Prompt.findById(savedPrompt._id)
                                        .populate('tags', 'name color')
                                        .populate('folder', 'name');
    res.status(201).json(populatedPrompt);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing prompt
// @route   PUT /api/prompts/:id
// @access  Public
export const updatePrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
     if (!isValidObjectId(req.params.id)) {
        res.status(400).json({ message: 'Invalid Prompt ID format' });
        return;
    }
    const { title, content, description, tags, folder } = req.body;

     // Validate tag IDs if provided
    if (tags && Array.isArray(tags)) {
        for (const tagId of tags) {
            if (!isValidObjectId(tagId)) {
                res.status(400).json({ message: `Invalid Tag ID format: ${tagId}` });
                return;
            }
        }
    }
     // Validate folder ID if provided (allow null/empty string to remove folder)
    if (folder && folder !== '' && !isValidObjectId(folder)) {
        res.status(400).json({ message: 'Invalid Folder ID format' });
        return;
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        description,
        tags: tags || [],
        folder: folder || null, // Handle setting folder to null
      },
      { new: true, runValidators: true } // Return the updated document and run validators
    ).populate('tags', 'name color').populate('folder', 'name');

    if (!updatedPrompt) {
      res.status(404).json({ message: 'Prompt not found' });
      return;
    }
    res.status(200).json(updatedPrompt);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a prompt
// @route   DELETE /api/prompts/:id
// @access  Public
export const deletePrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
     if (!isValidObjectId(req.params.id)) {
        res.status(400).json({ message: 'Invalid Prompt ID format' });
        return;
    }
    const prompt = await Prompt.findByIdAndDelete(req.params.id);

    if (!prompt) {
      res.status(404).json({ message: 'Prompt not found' });
      return;
    }
    res.status(200).json({ message: 'Prompt deleted successfully', promptId: req.params.id });
  } catch (error) {
    next(error);
  }
};