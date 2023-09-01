import bcrypt from "bcrypt"

import User from "../models/UserModel.js"
import Post from "../models/PostModel.js"

// Create
export const createUser = async (req, res) => {
  try {
    const data = req.body
    const userExists = await User.findOne({ email: data.email })
    // console.log(userExists)

    if (userExists) {
      return res.status(400).json({ msg: 'Username already exists' })
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt)

    const newUser = new User({
      email: data.email,
      password: passwordHash,
      firstName: data.firstName,
      lastName: data.lastName
    })

    const savedUser = await newUser.save()
    const { password, ...info } = savedUser._doc

    res.status(200).json(info)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// Get
export const getUsers = async (req, res) => {
  try {
    const data = await User.find()
    const users = []

    for (const user of data) {
      const { password, ...info } = user._doc
      users.push(info)
    }
    res.status(200).json(users)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// /:id
export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const givenUser = await User.findById(id).populate('following', ['firstName', 'lastName', 'profileImg'])

    if (!givenUser) {
      return res.status(400).json({ msg: "This user doesn't exist" })
    }

    const { password, ...info } = givenUser._doc

    res.status(200).json(info)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// /activity
export const getUsersActivity = async (req, res) => {
  try {
    const data = await User.find()
    const activity = []

    for (const user of data) {
      const recentPost = user.posts[0]
      if (recentPost) {
        const post = await Post.findById(recentPost);
        activity.push({
          userId: user._id,
          fullName: user.firstName + ' ' + user.lastName,
          time: post.updatedAt
        })
      }
    }

    activity.sort((a, b) => {
      const d1 = new Date(a.time)
      const d2 = new Date(b.time)
      return d2 - d1
    })

    res.status(200).json(activity);
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// Update (/:id)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    const userId = req.user.id

    console.log(userId)

    if (userId !== id) {
      return res.status(403).json({ msg: "Unauthorized access" })
    }

    const data = req.body
    const givenUser = await User.findById(id)

    if (!givenUser) {
      return res.status(400).json({ msg: "This user doesn't exist" })
    }

    if (data.profileImg) givenUser.profileImg = data.profileImg
    if (data.firstName) givenUser.firstName = data.firstName
    if (data.lastName) givenUser.lastName = data.lastName
    if (data.password) givenUser.password = data.password
    if (data.following) givenUser.following = data.following

    await givenUser.save()

    const { password, ...info } = givenUser._doc

    res.status(200).json(info)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// Delete
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const userId = req.user.id

    if (userId !== id) {
      return res.status(403).json({ msg: "Unauthorized access" })
    }

    const givenUser = await User.findById(id)

    if (!givenUser) {
      return res.status(400).json({ msg: "This user doesn't exist" })
    }

    const deleted = await User.deleteOne(givenUser)

    if (deleted) {
      res.status(200).json({ msg: "User successfully deleted" })
    } else {
      res.status(400).json({ msg: "Couldn't delete user" })
    }

  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}
