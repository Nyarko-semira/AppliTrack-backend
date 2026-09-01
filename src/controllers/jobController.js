const prisma = require("../config/prisma");

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      department,
      location,
      jobType,
      salary,
      description
    } = req.body;

    if (
      !title?.trim() ||
      !company?.trim() ||
      !department?.trim() ||
      !location?.trim() ||
      !jobType?.trim() ||
      !salary?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message: "All job fields are required."
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        department,
        location,
        jobType,
        salary,
        description,
        hrId: req.user.id,
        status: "OPEN"
      }
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create job."
    });
  }
};

const getHrJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      jobs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs."
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found."
      });
    }

    res.json({
      job
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch job."
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: "OPEN"
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      jobs
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch jobs."
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      company,
      department,
      location,
      jobType,
      salary,
      description
    } = req.body;

    if (
      !title?.trim() ||
      !company?.trim() ||
      !department?.trim() ||
      !location?.trim() ||
      !jobType?.trim() ||
      !salary?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message: "All job fields are required."
      });
    }

    const job = await prisma.job.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        company,
        department,
        location,
        jobType,
        salary,
        description
      }
    });

    res.json({
      message: "Job updated successfully",
      job
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Job not found."
      });
    }

    res.status(500).json({
      message: "Failed to update job."
    });
  }
};

const closeJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.update({
      where: {
        id: Number(id)
      },
      data: {
        status: "CLOSED"
      }
    });

    res.json({
      message: "Job closed successfully",
      job
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Job not found."
      });
    }

    res.status(500).json({
      message: "Failed to close job."
    });
  }
};

module.exports = {
  createJob,
  getHrJobs,
  getJobById,
  getJobs,
  updateJob,
  closeJob
};
