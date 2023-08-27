import bcrypt from "bcrypt"

import User from "../models/UserModel.js"
import { generateToken } from "../config/generateToken.js"

export const authInit = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      }).status(400).json({ msg: "This user doesn't exist" })
    }

    const { password, ...info } = user._doc

    res.status(200).json(info)
  } catch (err) {
    return res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).status(400).json(`Error: ${err}`)
  }
}

export const authLogin = async (req, res) => {
  try {
    const data = req.body
    const user = await User.findOne({ email: data.email })

    if (!user) {
      return res.status(400).json({ msg: "No such username exists. Try signing up" })
    }

    const passMatch = await bcrypt.compare(data.password, user.password)

    if (!passMatch) {
      return res.status(400).json({ msg: "Wrong password! Try again" })
    }

    const token = await generateToken(user._id)

    const { password, ...info } = user._doc

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).json(info).status(200)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

export const authRegister = async (req, res) => {
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

    const token = await generateToken(savedUser._id)

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).json(info).status(200)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

export const authLogout = async (req, res) => {
  try {
    return res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }).json({ msg: "Successfully logged out" }).status(200)
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}
