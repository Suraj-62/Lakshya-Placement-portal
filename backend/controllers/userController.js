import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    console.log("Profile Update Request - BODY:", req.body);
    if (req.file) {
      console.log("Profile Update Request - FILE Received:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        path: req.file.path, // This is the Cloudinary URL
        size: req.file.size
      });
    } else {
      console.log("Profile Update Request - No FILE received");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // ✅ image update
    if (req.file) {
      user.avatar = req.file.path; // Cloudinary returns the full URL in path
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });

  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    res.status(500).json({ 
      message: error.message || 'Profile update failed'
    });
  }
};