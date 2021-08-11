import { Service } from "@tsed/common";

import { Mailer } from "../util/mailer";
import config from "../../config";
import { Customer } from "../entity/Customer";

@Service()
export class MailService {

    async sendMailLinkReset(forgotCode: string, customer: Customer) {
        const subject = 'Yêu cầu quên mật khẩu.'
        const content = this.generateTemplateForgotPassword(forgotCode)
        Mailer.sendMail(customer.email, subject, content)
    }

    async sendMailReset(password: string, customer: Customer) {
        const subject = 'Thay đổi mật khẩu.'
        const content = this.generateTemplateResetPassword(password, customer)
        Mailer.sendMail(customer.email, subject, content)
    }


    generateTemplateResetPassword(password: string, customer: Customer) {
        let template = this.getFullTemplate()
        template = template.replace(/{{href}}/g, config.HOST);
        template = template.replace(/{{title}}/g, 'THAY ĐỔI MẬT KHẨU');
        const body = this.generateRow(`<h3>Mật khẩu mới để đăng nhập vào số điện thoại ${customer.phone} là: ${password}</h3>`)
        template = template.replace(/{{body}}/g, body);
        return template
    }

    generateTemplateForgotPassword(token: string) {
        let template = this.getFullTemplate()
        template = template.replace(/{{href}}/g, config.HOST);
        template = template.replace(/{{title}}/g, 'YÊU CẦU QUÊN MẬT KHẨU');
        const body = this.generateRow(`<h3>Vui lòng không chia sẽ mã này với bất kì ai. Đây là mã reset mật khẩu của bạn: ${token}</h3>`)
        template = template.replace(/{{body}}/g, body);
        return template
    }

    generateRow(contentRow: string) {
        let template = `<tr>
                    <td class="esd-block-text es-p20t"
                align = "left" >
                        <p style="color: #3f3736;" >{{contentRow}}</p>
                    </td>
                </tr>
                <tr>`
        return template.replace(/{{contentRow}}/g, contentRow);
    }


    getFullTemplate() {
        return `
        <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html>

        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title></title>
            <!--[if (mso 16)]>
            <style type="text/css">
            a {text-decoration: none;}
            </style>
            <![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        </head>


        <body>
            <div class="es-wrapper-color">
                <!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                        <v:fill type="tile" color="#f6f6f6"></v:fill>
                    </v:background>
                <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td class="esd-email-paddings" valign="top">
                                <table class="esd-header-popover es-content" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td class="esd-stripe" align="center">
                                                <table class="es-content-body" style="background-color: transparent;"
                                                    width="600" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-structure es-p20t es-p20b es-p20r es-p20l"
                                                                align="left">
                                                                <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="356" valign="top"><![endif]-->
                                                                <table class="es-left" cellspacing="0" cellpadding="0"
                                                                    align="left">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="es-m-p0r es-m-p20b esd-container-frame"
                                                                                width="356" valign="top" align="center">
                                                                                <table width="100%" cellspacing="0"
                                                                                    cellpadding="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-infoblock es-m-txt-c"
                                                                                                align="left">
                                                                                                <p></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <!--[if mso]></td><td width="20"></td><td width="184" valign="top"><![endif]-->
                                                                <table cellspacing="0" cellpadding="0" align="right">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-container-frame" width="184"
                                                                                align="left">
                                                                                <table width="100%" cellspacing="0"
                                                                                    cellpadding="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-infoblock es-m-txt-c"
                                                                                                align="right">
                                                                                                <p><a target="_blank"
                                                                                                        href="{{href}}"></a></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <!--[if mso]></td></tr></table><![endif]-->
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td class="esd-stripe" align="center" esd-custom-block-id="77306">
                                                <table class="es-content-body" width="600" cellspacing="0" cellpadding="0"
                                                    bgcolor="#ffffff" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-structure es-p20t es-p20b es-p20r es-p20l"
                                                                align="left">
                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-container-frame" width="560"
                                                                                valign="top" align="center">
                                                                                <table width="100%" cellspacing="0"
                                                                                    cellpadding="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-p15b"
                                                                                                align="left">
                                                                                                <h2>{{title}}</h2>
                                                                                            </td>
                                                                                        </tr>
                                                                                        {{body}}
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="es-footer" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td class="esd-stripe" align="center">
                                                <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0"
                                                    align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-structure es-p20t es-p20b es-p20r es-p20l"
                                                                align="left">
                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-container-frame" width="560"
                                                                                valign="top" align="center">
                                                                                <table width="100%" cellspacing="0"
                                                                                    cellpadding="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td align="center"
                                                                                                class="esd-empty-container"
                                                                                                style="display: none;"></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="esd-footer-popover es-content" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td class="esd-stripe" align="center">
                                                <table class="es-content-body" style="background-color: transparent;"
                                                    width="600" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-structure es-p30b es-p20r es-p20l" align="left">
                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-container-frame" width="560"
                                                                                valign="top" align="center">
                                                                                <table width="100%" cellspacing="0"
                                                                                    cellpadding="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td align="center"
                                                                                                class="esd-empty-container"
                                                                                                style="display: none;"></td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `
    }
}
