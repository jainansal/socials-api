import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.token

    if(!token) {
      return res.status(403).json({msg: "Access denied"})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) {
        return res.status(403).json({error: err.message})
      }
      req.user=user
      next()
    })
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
