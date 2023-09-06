import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    pfp: {
      type: String
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    bio: {
      type: String
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    requestsReceived: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    requestsSent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }, {
  timestamps: true
}
)

const User = mongoose.model('User', UserSchema)

export default User
