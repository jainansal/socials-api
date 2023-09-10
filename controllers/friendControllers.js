import User from "../models/UserModel.js";

export const getRequestsReceived = async (req, res) => {
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

    currentUser.populate({
      path: 'requestsReceived',
      select: "name pfp"
    })

    res.status(200).json(currentUser.requestsReceived)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getRequestsSent = async (req, res) => {
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

    res.status(200).json(currentUser.requestsSent)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const sendRequest = async (req, res) => {
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

    const receiverId = req.params.id;
    const receiveUser = await User.findById(receiverId);

    if (!receiveUser) {
      res.status(404);
      throw new Error("User not found.")
    }

    currentUser.requestsSent.unshift(receiverId);
    await currentUser.save();

    receiveUser.requestsReceived.unshift(authorId);
    await receiveUser.save();

    res.status(200).json("Request sent successfully");
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const respondRequest = async (req, res) => {
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

    const receiverId = req.params.id;
    const receiveUser = await User.findById(receiverId);

    if (!receiveUser) {
      res.status(404);
      throw new Error("User not found.")
    }

    if (!currentUser.requestsSent.includes(receiverId) || !receiveUser.requestsReceived.includes(authorId)) {
      currentUser.requestsSent = currentUser.requestsSent.filter(item => JSON.stringify(item) !== JSON.stringify(receiverId));
      await currentUser.save();

      receiveUser.requestsReceived = receiveUser.requestsReceived.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      await receiveUser.save();

      throw new Error("Requests don't align.");
    }

    const { action } = req.body;

    if (action === 'accept') {
      currentUser.requestsSent = currentUser.requestsSent.filter(item => JSON.stringify(item) !== JSON.stringify(receiverId));
      currentUser.friends.unshift(receiverId);
      await currentUser.save();

      receiveUser.requestsReceived = receiveUser.requestsReceived.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      receiveUser.friends.unshift(authorId);
      await receiveUser.save();
    } else if (action === 'reject') {
      currentUser.requestsSent = currentUser.requestsSent.filter(item => JSON.stringify(item) !== JSON.stringify(receiverId));
      await currentUser.save();

      receiveUser.requestsReceived = receiveUser.requestsReceived.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      await receiveUser.save();
    }

    res.status(200).json("Request responded successfully");
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const unfriendUser = async (req, res) => {
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

    const receiverId = req.params.id;
    const receiveUser = await User.findById(receiverId);

    if (!receiveUser) {
      res.status(404);
      throw new Error("User not found.")
    }

    if (!currentUser.friends.includes(receiverId) || !receiveUser.friends.includes(authorId)) {
      currentUser.friends = currentUser.friends.filter(item => JSON.stringify(item) !== JSON.stringify(receiverId));
      await currentUser.save();

      receiveUser.friends = receiveUser.friends.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      await receiveUser.save();

      throw new Error("You're not friends with the user.")
    }

    currentUser.friends = currentUser.friends.filter(item => JSON.stringify(item) !== JSON.stringify(receiverId));
    await currentUser.save();

    receiveUser.friends = receiveUser.friends.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
    await receiveUser.save();

    res.status(200).json("User unfriended");
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
