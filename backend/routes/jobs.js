import express from 'express'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = express.Router()

// GET /api/jobs — public, with search/filter
router.get('/', async (req, res) => {
  try {
    const { search, type, skill } = req.query
    const query = { isActive: true }
    if (type) query.type = type
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
    const jobs = await Job.find(query)
      .populate('company', 'name email')
      .populate('applicationCount')
      .sort('-createdAt')
      .limit(50)
    res.json({ jobs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/jobs/mine — company only
router.get('/mine', protect, requireRole('company'), async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id })
      .populate('applicationCount')
      .sort('-createdAt')
    res.json({ jobs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/jobs/:id — public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name email')
    if (!job) return res.status(404).json({ message: 'Job not found' })

    let hasApplied = false
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.default.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
        const app = await Application.findOne({ job: job._id, applicant: decoded.id })
        hasApplied = !!app
      } catch {}
    }

    res.json({ job, hasApplied })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/jobs — company only
router.post('/', protect, requireRole('company'), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, company: req.user._id })
    res.status(201).json({ job })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/jobs/:id — company only, own job
router.delete('/:id', protect, requireRole('company'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user._id })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    await job.deleteOne()
    await Application.deleteMany({ job: job._id })
    res.json({ message: 'Job deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
