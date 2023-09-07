import User from "../models/UserModel.js"

// Get all users
export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 30;

  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error('User not found.');
    }

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select("name pfp")

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get basic details
export const userBasicDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error('User not found.');
    }

    const givenId = req.params.id;
    const givenUser = await User.findById(givenId)
      .select("name username pfp bio");

    if (!givenUser) {
      res.status(404)
      throw new Error("User doesn't exist.");
    }

    res.status(200).json(givenUser);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get user friends
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      res.cookie('token', '', {
        secure: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error('User not found.');
    }

    const givenId = req.params.id;
    const givenUser = await User.findById(givenId)
      .select("friends");

    if (!givenUser) {
      res.status(404)
      throw new Error("User doesn't exist.");
    }

    res.status(200).json(givenUser);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
