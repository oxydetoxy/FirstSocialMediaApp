const nodeMailer = require("nodemailer");
const { options } = require("../routes/post");

//follow 3 step transport mailoption nd send
//passed option coz its a obeject contian n numbe rof options
const sendEmail = async (options) => {
  const transport = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMTP_PASS,
    },
    service: process.env.SMTP_SERVCIES,
  });

  const messageOption = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subeject: options.subeject,
    text: options.message,
  };

  await transport.sendMail(messageOption);
};
