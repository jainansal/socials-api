import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: []
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
  timestamps: true
}
)

const Post = mongoose.model('Post', PostSchema)

export default Post
