const createTransport = require('nodemailer').createTransport;
const logger = require('./logger');

function sendMail(receiver, recieverMail, subject, content) {
    var mailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediManager - Email</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
    }

    p {
      color: #555;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      color: #777;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>MediManager</h1>
    <p>Dear ${receiver},</p>
    ${content}
    
    <div class="footer">
      <p>Best regards,<br> The MediManager Team</p>
    </div>
  </div>
</body>
</html>
`;

    var transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_MAIL,
            pass: process.env.MAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.APP_MAIL,
        to: recieverMail,
        subject: subject,
        html: mailBody
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
            logger.error('Email sent failed to: ' + recieverMail);
        } else {
            logger.info('Email succesfully sent to: ' + recieverMail);
        }
    });
}

function sendEmployeeInitialPassword(employeeName, employeeMail, password) {
    var content = `
    <p>We are excited to welcome you to our team at MediManager. Your employee account has been successfully created.</p>
    <p>Please find below your login credentials:</p>
    <ul>
      <li><strong>Username:</strong> ${employeeMail}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p>With your account, you will have access to various resources and tools to support your work.</p>
    <p>If you have any questions or need assistance, please do not hesitate to reach out to the HR department.</p>
    `;

    var subject = "Welcome to MediManager: Your Employee Account Details";
    sendMail(employeeName, employeeMail, subject, content);
}

module.exports = {
    sendMail,
    sendEmployeeInitialPassword
};