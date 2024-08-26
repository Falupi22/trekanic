import nodemailer from "nodemailer"

export enum InformType {
  delete = "delete",
  edit = "edit",
}

type InformTypeValues = keyof typeof InformType

const sendEmail = async (recipient: string, appointment, informType: InformTypeValues) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const subject = `Your appointment has been ` + (informType === InformType.delete ? "deleted!" : "edited!")
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipient,
    subject: subject,
    text: JSON.stringify(appointment),
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    /* empty */
  }
}

export default sendEmail
