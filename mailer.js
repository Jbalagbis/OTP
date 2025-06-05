const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fabillalita@gmail.com', 
    pass: 'Joelfabillabalagbis29.',        
  },
});

const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: 'fabillalita@gmail.com', 
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        reject(new Error(`Failed to send OTP email: ${error.message}`)); 
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
};

module.exports = sendOTPEmail;
