import User from "../models/UserModel.js";

export const getRequestsReceived = async (req, res) => {
  try {
    const authorId = req.user.id;
    const currentUser = await User.findById(authorId).populate({
      path: 'requestsReceived',
      select: "name pfp"
    })

    if (!currentUser) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error("User not found.")
    }

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
    const receiver = await User.findById(authorId);

    if (!receiver) {
      res.status(404);
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      throw new Error("User not found.")
    }

    const senderId = req.params.id;
    const sender = await User.findById(senderId);

    if (!sender) {
      res.status(404);
      throw new Error("User not found.")
    }

    if (!sender.requestsSent.includes(authorId) || !receiver.requestsReceived.includes(senderId)) {
      sender.requestsSent = sender.requestsSent.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      await sender.save();

      receiver.requestsReceived = receiver.requestsReceived.filter(item => JSON.stringify(item) !== JSON.stringify(senderId));
      await receiver.save();

      throw new Error("Requests don't align");
    }

    const { action } = req.body;

    if (action === 'accept') {
      sender.requestsSent = sender.requestsSent.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      sender.friends.unshift(authorId);
      await sender.save();

      receiver.requestsReceived = receiver.requestsReceived.filter(item => JSON.stringify(item) !== JSON.stringify(senderId));
      receiver.friends.unshift(senderId);
      await receiver.save();
    } else if (action === 'reject') {
      sender.requestsSent = sender.requestsSent.filter(item => JSON.stringify(item) !== JSON.stringify(authorId));
      await sender.save();

      receiver.requestsReceived = receiver.requestsReceived.filter(item => JSON.stringify(item) !== JSON.stringify(senderId));
      await receiver.save();
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
