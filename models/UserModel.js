import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    /*
      To-do:
        1. Add validators
    */
    email: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profileImg: {
      type: String,
      default: 'https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png',
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  }, {
  timestamps: true
}
)

const User = mongoose.model('User', UserSchema)

export default User
