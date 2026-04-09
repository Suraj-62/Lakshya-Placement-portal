import User from '../models/User.js';
import mongoose from 'mongoose';

// ✅ TOGGLE BOOKMARK (POST /api/bookmarks/:questionId)
export const toggleBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
       return res.status(400).json({ message: 'Invalid question ID' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isBookmarked = user.bookmarks.includes(questionId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== questionId);
    } else {
      // Add bookmark
      user.bookmarks.push(questionId);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !isBookmarked,
      bookmarks: user.bookmarks
    });

  } catch (error) {
    next(error);
  }
};

// ✅ GET BOOKMARKS (GET /api/bookmarks)
export const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
        path: 'bookmarks',
        populate: { path: 'category' }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.bookmarks);

  } catch (error) {
    next(error);
  }
};
