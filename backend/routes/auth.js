import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendStatusEmail } from '../utils/email.js'
import { sendWelcomeEmail } from '../utils/email.js'

const router = express.Router()

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password, role })
try {
  await sendWelcomeEmail({ to: email, name })
} catch (emailErr) {
  console.error('Welcome email failed:', emailErr.message)
}
res.status(201).json({ token: signToken(user._id), user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })
    res.json({ token: signToken(user._id), user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
