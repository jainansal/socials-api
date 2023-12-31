import bcrypt from "bcrypt"

import User from "../models/UserModel.js"
import { generateToken } from "../config/generateToken.js"
import Post from "../models/PostModel.js"
import Comment from "../models/CommentModel.js"

export const authInit = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      res.status(404);
      throw new Error('Authorization error');
    }

    res.status(200).json({
      id: userId
    });
  } catch (err) {
    res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    res.status(500).json({ message: err.message });
  }
}

export const authLogin = async (req, res) => {
  try {
    const data = req.body
    const user = await User.findOne({ username: data.username })

    if (!user) {
      res.status(404)
      throw new Error("No such username exists. Try signing up.")
    }

    const passMatch = await bcrypt.compare(data.password, user.password)

    if (!passMatch) {
      res.status(400)
      throw new Error("Wrong password! Try again.")
    }

    const token = await generateToken(user._id)

    res.status(200).cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).json("Logged in successfully!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const authRegister = async (req, res) => {
  try {
    const data = req.body
    const userExists = await User.findOne({ username: data.username })

    if (userExists) {
      res.status(400)
      throw new Error("Username already exists. Try logging in or choose a different username.")
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt)

    const newUser = new User({
      username: data.username,
      password: passwordHash,
      name: data.name,
    })

    await newUser.save()

    const token = await generateToken(newUser._id)

    res.status(200).cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).json("Registered successfully!")
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const authLogout = async (req, res) => {
  try {
    res.status(200).cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).json("Logged out successfully!")
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const authDelete = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      res.status(404);
      throw new Error('Authorization error');
    }
    
    const friends = user.friends;
    for (const id of friends) {
      const curUser = await User.findById(id);
      curUser.friends = curUser.friends.filter(item => JSON.stringify(item) !== JSON.stringify(userId));
      await curUser.save();
    }
    
    await Post.deleteMany({ author: userId });
    await Comment.deleteMany({ author: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json("User successfully deleted!");
  } catch (err) {
    res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    res.status(500).json({ message: err.message });
  }
}
