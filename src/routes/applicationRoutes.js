const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const { applyForJob, getMyApplications, getHrApplications, updateApplicationStatus, getApplicationById } = require("../controllers/applicationController");

const router = express.Router();

router.post(
  "/jobs/:jobId/apply",
  authMiddleware,
  authorizeRole("USER"),
  applyForJob
);

router.get(
  "/applications/my",
  authMiddleware,
  authorizeRole("USER"),
  getMyApplications
);

router.get(
  "/applications/:id",
  authMiddleware,
  getApplicationById
);

router.get(
  "/hr/applications",
  authMiddleware,
  authorizeRole("HR"),
  getHrApplications
);

router.patch(
  "/applications/:id/status",
  authMiddleware,
  authorizeRole("HR"),
  updateApplicationStatus
);



module.exports = router;
