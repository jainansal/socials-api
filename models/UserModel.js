import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    /*
      To-do:
        1. Add validators
    */
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
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
