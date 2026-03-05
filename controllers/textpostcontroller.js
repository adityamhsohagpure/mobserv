const TextPost = require("../models/TextPost");

exports.createTextPost = async (req, res) => {
  try {

    const { userid, username, text, caption, textColor } = req.body;

    const newPost = new TextPost({
      textPostId: "text_" + Date.now(),
      userid,
      username,
      text,
      caption,
      textColor,
      type: "text"
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};