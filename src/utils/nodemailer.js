const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PORT, EMAIL_PASS, EMAIL_HOST } = require("./secrets");

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `"Blossom" <${EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = { sendMail };
