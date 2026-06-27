import express from 'express'
import Application from '../models/Application.js'
import Job from '../models/Job.js'
import { protect, requireRole } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { sendStatusEmail } from '../utils/email.js'

const router = express.Router()

// POST /api/jobs/:id/apply — applicant applies
router.post('/jobs/:id/apply', protect, requireRole('applicant'), upload.single('resume'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const exists = await Application.findOne({ job: job._id, applicant: req.user._id })
    if (exists) return res.status(409).json({ message: 'Already applied' })

    const app = await Application.create({
      job: job._id,
      applicant: req.user._id,
      resumeUrl: req.file?.path || null,
      coverLetter: req.body.coverLetter || '',
    })

    res.status(201).json({ application: app })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/applications/my — applicant's applications
router.get('/my', protect, requireRole('applicant'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .sort('-createdAt')
    res.json({ applications })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/applications/job/:jobId — company views applicants for a job
router.get('/job/:jobId', protect, requireRole('company'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, company: req.user._id })
    if (!job) return res.status(404).json({ message: 'Job not found' })

    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'name email')
      .sort('-createdAt')

    res.json({ applications, jobTitle: job.title })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/applications/:id/status — company updates status
router.patch('/:id/status', protect, requireRole('company'), async (req, res) => {
  try {
    const { status } = req.body
    const app = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })

    if (!app) return res.status(404).json({ message: 'Application not found' })

    // Verify company owns this job
    if (app.job.company._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' })

    app.status = status
    await app.save()

    // Send email notification to applicant
    await sendStatusEmail({
      to: app.applicant.email,
      applicantName: app.applicant.name,
      jobTitle: app.job.title,
      status,
    })

    res.json({ application: app })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
