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
      type: String,
      default: 'https://exploringbits.com/wp-content/uploads/2022/01/Manga-PFP-1.jpg?ezimgfmt=ng%3Awebp%2Fngcb3%2Frs%3Adevice%2Frscb3-1'
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    bio: {
      type: String,
      default: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, tenetur.'
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
