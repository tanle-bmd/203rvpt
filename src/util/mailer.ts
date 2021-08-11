import nodemailer from 'nodemailer'
import config from '../../config';
import logger from './logger';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS
    }
})

export class Mailer {
    static async sendMail(to: string, subject: string, html: string) {
        try {
            let info = await transporter.sendMail({
                from: config.MAIL_USER,
                to,
                subject,
                html
            });
            console.log('info:', info)
            logger('info').info('Sent mail info: ', info)
        } catch (error) {
            console.log('error:', error)
            logger('error').error('Sent mail error: ', error)
        }
    }

}