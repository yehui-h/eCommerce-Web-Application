module.exports = {
    mail
}

function mail(to, title, content) {
    //// import dependencies
    const nodemailer = require('nodemailer');

    //Configure the send mail interface
    let transporter = nodemailer.createTransport({
        service: 'qq',
        port: 465,
        secure: false,
        auth: {
            user: '452789577@qq.com', //sender's email
            pass: 'oomiwgbbkpjrbgha' //The authorization code of the sender's mailbox, generally go to the mailbox settings to find it, you should be able to find it
        }
    });

    //email information
    let info = {
            from: 'Email server <452789577@qq.com>',
            to: to,
            subject: title,
            // text: text,
            html: html

        }
        //send email
    return new Promise((resolve, reject) => {
        transporter.sendMail(info, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        });
    })
}