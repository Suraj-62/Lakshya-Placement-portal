import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // ✅ image update
    if (req.file) {
      console.log("Saving Cloudinary URL:", req.file.path);
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
    console.error("Profile Update Error:", error);
    res.status(500).json({ 
      message: 'Profile update failed',
      error: error.message 
    });
  }
};