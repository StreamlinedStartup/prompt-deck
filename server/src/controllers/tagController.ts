import { Request, Response, NextFunction } from 'express';
import Tag, { ITag } from '../models/Tag';
import Prompt from '../models/Prompt'; // Import Prompt model to update references

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a tag
// @route   POST /api/tags
// @access  Public
export const createTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, color } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Tag name is required' });
      return;
    }
    const newTag = new Tag({ name, color });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
     // Handle potential duplicate key error (unique name constraint)
     if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        res.status(409).json({ message: 'Tag with this name already exists' });
        return;
      }
    next(error);
  }
};

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Public
export const updateTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, color } = req.body;
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            { name, color },
            { new: true, runValidators: true } // Return updated doc, run schema validators
        );

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }
        res.status(200).json(tag);
    } catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            res.status(409).json({ message: 'Tag with this name already exists' });
            return;
        }
        next(error);
    }
};


// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Public
export const deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tagId = req.params.id;
        const tag = await Tag.findById(tagId);

        if (!tag) {
            res.status(404).json({ message: 'Tag not found' });
            return;
        }

        // Remove the tag reference from all prompts that use it
        await Prompt.updateMany(
            { tags: tagId },
            { $pull: { tags: tagId } }
        );

        await Tag.findByIdAndDelete(tagId);

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        next(error);
    }
};