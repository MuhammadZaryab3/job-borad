import mongoose from 'mongoose'
import slugify from 'slugify'

const jobSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  slug:         { type: String, unique: true },
  type:         { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship'], default: 'Full-time' },
  location:     { type: String, default: 'Remote' },
  salary:       { type: String },
  description:  { type: String, required: true },
  requirements: [{ type: String }],
  company:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

jobSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true,
})

jobSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now()
  }
  next()
})

export default mongoose.model('Job', jobSchema)
