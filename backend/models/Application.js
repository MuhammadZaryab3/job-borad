import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl:   { type: String },
  coverLetter: { type: String },
  status:      { type: String, enum: ['applied', 'reviewed', 'interview', 'rejected'], default: 'applied' },
}, { timestamps: true })

// One application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

export default mongoose.model('Application', applicationSchema)
