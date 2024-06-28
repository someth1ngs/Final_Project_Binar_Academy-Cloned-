const nodemailer = require("nodemailer");
const ejs = require("ejs");

// Function to send verification email
exports.sendVerifyEmail = async (userData, token) => {
  try {
    // Create a transporter object using Gmail service
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PW_EMAIL_SENDER,
      },
    });

    // Construct the verification URL
    let url = `${process.env.FE_URL}/verify/${token}`;
    // Generate the HTML content for the email using EJS template
    let html = await getHTML("verification-code.ejs", { name: userData.name, verify_url: url });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: userData.email,
      subject: "NgeFly - Email Verification",
      html: html,
    };

    // Send the email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return {
      status: true,
      message: "Success to Send Email",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function to send reset password email
exports.sendResetPassword = async (userData, token) => {
  try {
    // Create a transporter object using Gmail service
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PW_EMAIL_SENDER,
      },
    });

    // Construct the reset password URL
    let url = `${process.env.FE_URL}/resetpassword/${token}`;
    // Generate the HTML content for the email using EJS template
    let html = await getHTML("link-reset.ejs", { name: userData.name, verify_url: url });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: userData.email,
      subject: "NgeFly - Reset Password",
      html: html,
    };

    // Send the email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return {
      status: true,
      message: "Success to Send Email",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Helper function to generate HTML from EJS template
const getHTML = (fileName, data) => {
  return new Promise((resolve, reject) => {
    // Define the path to the EJS template file
    const path = `${__dirname}/../views/templates/${fileName}`;
    // Render the EJS template file with the provided data
    ejs.renderFile(path, data, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};
