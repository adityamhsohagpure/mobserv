const express = require("express");
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getIncomingRequests,
  getSentRequests,
  getFriends
} = require("../controllers/friendController");

router.post("/send", sendRequest);
router.post("/accept", acceptRequest);
router.post("/reject", rejectRequest);
router.post("/cancel", cancelRequest);

router.get("/incoming/:userId", getIncomingRequests);
router.get("/sent/:userId", getSentRequests);
router.get("/list/:userId", getFriends);

module.exports = router;
