const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
const { createJob  , getHrJobs , getJobById, getJobs , updateJob, closeJob} = require("../controllers/jobController");

const router = express.Router();

router.post(
  "/jobs",
  authMiddleware,
  authorizeRole("HR"),
  createJob
);

router.get(
  "/hr/jobs",
  authMiddleware,
  authorizeRole("HR"),
  getHrJobs
);

router.get(
  "/jobs/:id",
  getJobById
);


router.get(
  "/jobs",
  getJobs
);

router.patch(
  "/jobs/:id",
  authMiddleware,
  authorizeRole("HR"),
  updateJob
);

router.patch(
  "/jobs/:id/close",
  authMiddleware,
  authorizeRole("HR"),
  closeJob
);

module.exports = router;