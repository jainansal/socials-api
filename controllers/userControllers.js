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

// Get advanced details
export const userAdvancedDetails = async (req, res) => {
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

    const data = {
      friends: user.friends,
      received: user.requestsReceived,
      sent: user.requestsSent
    }

    res.status(200).json(data);
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
      .populate({
        path: 'friends',
        select: 'name pfp'
      })

    if (!givenUser) {
      res.status(404)
      throw new Error("User doesn't exist.");
    }

    res.status(200).json(givenUser.friends);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateBasicDetails = async (req, res) => {
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

    const data = req.body;

    if (data.name) user.name = data.name;
    if (data.bio) user.bio = data.bio;
    if (data.pfp) user.pfp = data.pfp;

    await user.save();

    res.status(200).json("User updated successfully");
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
