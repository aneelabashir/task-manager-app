const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.sendGrid_API_key)

sgMail.send({
    to:'anilabasheer95@gmail.com',
    from: 'andrew@mead.io',
    subject: 'This is first email',
    text: 'I hope It works out for me!'
})