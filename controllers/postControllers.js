import Post from "../models/PostModel.js"
import User from "../models/UserModel.js"

// Create
export const createPost = async (req, res) => {
  try {

    const authorId = req.user.id
    const { content } = req.body
    const currentUser = await User.findById(authorId)

    if (!currentUser) {
      return res.status(400).json({ msg: "This user doesn't exist" })
    }

    const newPost = new Post({
      content,
      author: authorId
    })

    const savedPost = await newPost.save()

    if (!savedPost) {
      return res.status(400).json({ msg: "Some error occurred while saving the post" })
    }
    currentUser.posts.unshift(savedPost._id)
    currentUser.save()

    return res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// Get
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', ['firstName', 'lastName', 'profileImg']).sort({ updatedAt: -1 })
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

export const getPost = async (req, res) => {
  try {
    const { id } = req.params
    const givenPost = await Post.findById(id).populate('author', ['firstName', 'lastName', 'profileImg'])

    if (!givenPost) {
      return res.status(400).json({ msg: "This post doesn't exist" })
    }

    res.status(200).json(givenPost)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}


// Update
export const updatePost = async (req, res) => {
  try {
    const authorId = req.user.id

    if (!authorId) {
      return res.status(403).json({ msg: "Unauthorized access" })
    }

    const { id } = req.params
    const givenPost = await Post.findById(id)

    if (!givenPost) {
      return res.status(400).json({ msg: "This post doesn't exist" })
    }

    const data = req.body

    if (givenPost.author !== authorId && data.content) {
      return res.status(403).json({ msg: "Unauthorized access" })
    }

    if (data.likeCount) givenPost.likeCount = data.likeCount
    if (data.content) givenPost.content = data.content
    if (data.likes) givenPost.likes = data.likes
    if (data.comments) givenPost.comments = data.comments

    const updatedPost = await givenPost.save()

    if (!updatedPost) {
      res.status(400).json({ msg: "Some error occurred while updating" })
    } else {
      res.status(200).json(updatedPost)
    }
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}

// Delete
export const deletePost = async (req, res) => {
  try {
    const authorId = req.user.id

    if (!authorId) {
      return res.status(403).json({ msg: "Unauthorized access" })
    }

    const { id } = req.params
    const givenPost = await Post.findById(id)

    if (!givenPost) {
      return res.status(400).json({ msg: "This post doesn't exist" })
    }

    if (givenPost.author !== authorId) {
      return res.status(403).json({ msg: "Unauthorized access" })
    }

    const deleted = await Post.deleteOne(givenPost)

    if (deleted) {
      res.status(200).json({ msg: "Post successfully deleted" })
    } else {
      res.status(400).json({ msg: "Couldn't delete post" })
    }
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}
