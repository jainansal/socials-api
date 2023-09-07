import Post from "../models/PostModel.js"
import User from "../models/UserModel.js"

// Create
export const newPost = async (req, res) => {
  try {
    const authorId = req.user.id;
    const currentUser = await User.findById(authorId);

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
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
        select: "name pfp"
      })
      .select("-comments")

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
      .select("-comments")

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
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
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
        .select("-comments")
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
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
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
        .select("-comments")

      data.push(details);
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getPostComments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  try {
    const id = req.params.id;
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

    const postId = req.params.id;
    const postComments = await Post.findById(postId)
      .select("comments")
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name'
        }
      })

    if (!postComments) {
      res.status(404);
      throw new Error("Post not found.")
    }

    res.status(200).json(postComments);
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
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error('User not found.');
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found.');
    }

    const postLikes = post.likes;


    if (postLikes.includes(userId)) {
      postLikes = postLikes.filter(item => JSON.stringify(item) !== JSON.stringify(userId));
    } else {
      postLikes.unshift(userId);
    }

    post.likes = postLikes;

    await post.save();

    res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error('User not found.');
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found.');
    }

    const { content } = req.body;

    const comment = new Comment({
      content,
      author: userId
    });

    await comment.save();

    post.comments.unshift(comment._id);

    await post.save();

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error('User not found.');
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404);
      throw new Error('Post not found.');
    }

    if (JSON.stringify(post.author) !== JSON.stringify(userId)) {
      res.status(404);
      throw new Error('Unauthorized access.')
    }

    await Post.deleteOne(post);

    res.status(200).json("Post successfully deleted!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
