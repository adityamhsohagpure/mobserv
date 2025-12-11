const User = require("../models/User");

// ======================================================
// SEND FRIEND REQUEST
// ======================================================
exports.sendRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: "Missing user IDs" });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "You cannot add yourself" });
    }

    const fromUser = await User.findOne({ userId: fromUserId });
    const toUser = await User.findOne({ userId: toUserId });

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Already friends
    if (fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ error: "Already friends" });
    }

    // Already sent request
    if (fromUser.sentRequests.includes(toUserId)) {
      return res.status(400).json({ error: "Request already sent" });
    }

    // Add request
    fromUser.sentRequests.push(toUserId);
    toUser.incomingRequests.push(fromUserId);

    await fromUser.save();
    await toUser.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("SendRequest Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================================================
// ACCEPT FRIEND REQUEST
// ======================================================
exports.acceptRequest = async (req, res) => {
  try {
    const { currentUserId, fromUserId } = req.body;

    if (!currentUserId || !fromUserId) {
      return res.status(400).json({ error: "Missing user IDs" });
    }

    const currentUser = await User.findOne({ userId: currentUserId });
    const fromUser = await User.findOne({ userId: fromUserId });

    if (!currentUser || !fromUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove pending requests
    currentUser.incomingRequests = currentUser.incomingRequests.filter(
      (id) => id !== fromUserId
    );
    fromUser.sentRequests = fromUser.sentRequests.filter(
      (id) => id !== currentUserId
    );

    // Add to friends list
    currentUser.friends.push(fromUserId);
    fromUser.friends.push(currentUserId);

    await currentUser.save();
    await fromUser.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("AcceptRequest Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================================================
// REJECT FRIEND REQUEST
// ======================================================
exports.rejectRequest = async (req, res) => {
  try {
    const { currentUserId, fromUserId } = req.body;

    if (!currentUserId || !fromUserId) {
      return res.status(400).json({ error: "Missing user IDs" });
    }

    const currentUser = await User.findOne({ userId: currentUserId });
    const fromUser = await User.findOne({ userId: fromUserId });

    if (!currentUser || !fromUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove from pending lists
    currentUser.incomingRequests = currentUser.incomingRequests.filter(
      (id) => id !== fromUserId
    );
    fromUser.sentRequests = fromUser.sentRequests.filter(
      (id) => id !== currentUserId
    );

    await currentUser.save();
    await fromUser.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error("RejectRequest Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================================================
// CANCEL FRIEND REQUEST
// ======================================================
exports.cancelRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: "Missing user IDs" });
    }

    const fromUser = await User.findOne({ userId: fromUserId });
    const toUser = await User.findOne({ userId: toUserId });

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove pending request
    fromUser.sentRequests = fromUser.sentRequests.filter(
      (id) => id !== toUserId
    );
    toUser.incomingRequests = toUser.incomingRequests.filter(
      (id) => id !== fromUserId
    );

    await fromUser.save();
    await toUser.save();

    res.json({ message: "Friend request canceled" });
  } catch (err) {
    console.error("CancelRequest Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================================================
// GET INCOMING REQUESTS
// ======================================================
exports.getIncomingRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const incoming = await User.find(
      { userId: { $in: user.incomingRequests } },
      "userId username email"
    );

    res.json({ requests: incoming });
  } catch (err) {
    console.error("IncomingRequests Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================================================
// GET SENT REQUESTS
// ======================================================
exports.getSentRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const sent = await User.find(
      { userId: { $in: user.sentRequests } },
      "userId username email"
    );

    res.json({ requests: sent });
  } catch (err) {
    console.error("SentRequests Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================================================
// GET FRIEND LIST
// ======================================================
exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const friends = await User.find(
      { userId: { $in: user.friends } },
      "userId username email"
    );

    res.json({ friends });
  } catch (err) {
    console.error("GetFriends Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
