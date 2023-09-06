import Post from "../models/PostModel.js"
import User from "../models/UserModel.js"

// Create
export const newPost = async (req, res) => {
  try {
    const authorId = req.user.id;
    const currentUser = await User.findById(authorId);

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '');
      throw new Error("User not found.")
    }

    const { content } = req.body

    const newPost = new Post({
      content,
      author: authorId
    })

    const savedPost = await newPost.save()

    if (!savedPost) {
      res.status(500);
      throw new Error("Couldn't save the post.")
    }

    currentUser.posts.unshift(savedPost._id)
    currentUser.save()

    return res.status(200).json(savedPost)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: 'author',
        select: "firstName lastName profileImg"
      })

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getTrendingPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;

  try {
    const posts = await Post.find()
      .sort({ likeCount: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: 'author',
        select: "name pfp"
      })

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getFriendsPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  try {

    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '');
      throw new Error('User not found.');
    }

    const friends = currentUser.friends;

    const posts = []
    for (const friend in friends) {
      const friendPosts = await Post.find({ author: friend })
        .sort({ createdAt: -1 })
        .populate({
          path: 'author',
          select: 'name pfp'
        })
      posts.push(friendPosts)
    }

    console.log(posts)

    posts.sort((a, b) => {
      return a.createdAt > b.createdAt
    });

    console.log(posts);

    const data = posts.slice(perPage * (page - 1), perPage * page);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      res.cookie('token', '');
      throw new Error('User not found.');
    }

    const posts = user.posts;
    const data = [];

    for (const post in posts) {
      const details = await Post.findById(post)
        .populate({
          path: 'author',
          select: 'name pfp'
        })

      data.push(details);
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '');
      throw new Error('User not found.');
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found.');
    }

    post.likeCount++;
    post.likes.unshift(userId);

    await post.save();

    
  } catch (err) {
    res.status(500).json({ message: err.message });
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

export const toggleLike = async (req, res) => {
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

    if (givenPost.likes.includes(authorId)) {
      givenPost.likes = givenPost.likes.filter(item => JSON.stringify(item) !== JSON.stringify(authorId))
    } else {
      givenPost.likes.unshift(authorId);
    }
    givenPost.likeCount = givenPost.likes.length


    const updatedPost = await givenPost.save()

    res.status(200).json({ msg: 'ok' })
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
