const prisma = require("../config/prisma");

// const applyForJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;

//     const { skills, resumeUrl, resumeFileName, coverLetter } = req.body;

//     // Check if the job exists
//     const job = await prisma.job.findUnique({
//       where: {
//         id: Number(jobId)
//       }
//     });

//     if (!job) {
//       return res.status(404).json({
//         message: "Job not found."
//       });
//     }

//     // Check if the job is still open
//     if (job.status === "CLOSED") {
//       return res.status(400).json({
//         message: "This job is closed and no longer accepting applications."
//       });
//     }

//     const application = await prisma.application.create({
//       data: {
//         applicantId: req.user.id,
//         jobId: Number(jobId),
//         skills,
//         resumeUrl,
//         resumeFileName,
//         coverLetter
//       }
//     });

//     res.status(201).json({
//       message: "Application submitted successfully",
//       application
//     });

//   } catch (error) {
//     console.error(error);

//     if (error.code === "P2002") {
//       return res.status(409).json({
//         message: "You have already applied for this job."
//       });
//     }

//     res.status(500).json({
//       message: "Failed to submit application"
//     });
//   }
// };


const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const {
      skills,
      resumeUrl,
      resumeFileName,
      coverLetter
    } = req.body;

    // Validate  fields
    if (
      !skills?.trim() ||
      !resumeUrl?.trim() ||
      !resumeFileName?.trim() ||
      !coverLetter?.trim()
    ) {
      return res.status(400).json({
        message: "Skills, resume, resume file name, and cover letter are required."
      });
    }

    // Check if the job exists
    const job = await prisma.job.findUnique({
      where: {
        id: Number(jobId)
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found."
      });
    }

    // Check if the job is still open
    if (job.status === "CLOSED") {
      return res.status(400).json({
        message: "This job is closed and no longer accepting applications."
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        applicantId: req.user.id,
        jobId: Number(jobId),
        skills: skills.trim(),
        resumeUrl: resumeUrl.trim(),
        resumeFileName: resumeFileName.trim(),
        coverLetter: coverLetter.trim()
      }
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error(error);

    // Duplicate application
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "You have already applied for this job."
      });
    }

    res.status(500).json({
      message: "Failed to submit application."
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        applicantId: req.user.id
      },
      include: {
        job: true
      }
    });

    res.json({
      applications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your applications"
    });
  }
};

const getHrApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: true
      },
      orderBy: {
        appliedAt: "desc"
      }
    });

    res.json({
      applications
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications"
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "INTERVIEW",
      "OFFER",
      "REJECTED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status."
      });
    }

    const application = await prisma.application.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      }
    });

    res.json({
      message: "Application status updated successfully",
      application
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Application not found."
      });
    }

    res.status(500).json({
      message: "Failed to update application status"
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getHrApplications,
  updateApplicationStatus
};