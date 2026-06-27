import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
})

export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    await transporter.sendMail({
      from: `Jobie <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to Jobie! 🎉',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:auto;padding:32px;background:#F5F5FF;border-radius:16px">
          <h2 style="color:#1E1B4B">Welcome, ${name}!</h2>
          <p style="color:#555">Your Jobie account is ready. Start exploring jobs or posting opportunities.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
            style="display:inline-block;margin-top:16px;background:#6C63FF;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600">
            Go to Jobie
          </a>
        </div>
      `
    })
  } catch (err) {
    console.error('Welcome email error:', err.message)
  }
}

export const sendStatusEmail = async ({ to, applicantName, jobTitle, status }) => {
  const messages = {
    reviewed:  `Your application for "${jobTitle}" is being reviewed.`,
    interview: `Congratulations! You've been selected for an interview for "${jobTitle}".`,
    rejected:  `Thank you for applying to "${jobTitle}". Unfortunately, we won't be moving forward.`,
  }
  if (!messages[status]) return

  try {
    await transporter.sendMail({
      from: `Jobie <${process.env.EMAIL_USER}>`,
      to,
      subject: `Application Update — ${jobTitle}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:auto;padding:32px;background:#F5F5FF;border-radius:16px">
          <h2 style="color:#1E1B4B;margin-bottom:8px">Hi ${applicantName},</h2>
          <p style="color:#555;line-height:1.6">${messages[status]}</p>
          <p style="color:#6C63FF;font-weight:600;margin-top:24px">Status: ${status.toUpperCase()}</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/applicant/applications"
            style="display:inline-block;margin-top:16px;background:#6C63FF;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600">
            View Application
          </a>
          <p style="color:#999;font-size:12px;margin-top:32px">Jobie — Find Your Dream Job</p>
        </div>
      `
    })
  } catch (err) {
    console.error('Email error:', err.message)
  }
}
