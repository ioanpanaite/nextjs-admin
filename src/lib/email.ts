import sendgrid, { MailDataRequired } from '@sendgrid/mail';

export const EMAIL_SENDER: string = "no-reply@wearenom.com";

export interface DynamicEmailType {
  to: string
  data: any
  template_id: string
}

export async function sendEmail() {

  // Get reset password email option
  // const mailOption = {
  //   from: {
  //     email: EMAIL_SENDER
  //   },
  //   personalizations: [
  //     {
  //       to: [
  //         {
  //           email: info.to
  //         }
  //       ],
  //       dynamic_template_data: {
  //         action_url: info.action_url,
  //         support_url: info.support_url,
  //         operating_system: info.operating_system,
  //         browser_name: info.browser_name,
  //       }
  //     }
  //   ],
  //   template_id: config.sendgrid_forgot_pass_email
  // };

  const msg = {
    to: 'topnotchdev@outlook.com',
    from: EMAIL_SENDER,
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

  if (msg) {
    try {
      const sendgridApiKey = process.env.SENDGRID_API_KEY as string
      sendgrid.setApiKey(sendgridApiKey);
      const result = await sendgrid.send(msg)
      if (result) return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
      console.error(error);
    }
  }

  return { success: false, message: 'Email type or something went wrong.' };
}

export async function sentDynamicEmail(info: DynamicEmailType) {

  // Get reset password email option
  const mailOption: MailDataRequired = {
    from: {
      email: EMAIL_SENDER
    },
    personalizations: [
      {
        to: [
          {
            email: info.to
          }
        ],
        dynamicTemplateData: info.data
      }
    ],
    templateId: info.template_id,
    trackingSettings: {
      clickTracking: { enable: false }
    }
  };

  if (mailOption) {
    try {
      const sendgridApiKey = process.env.SENDGRID_API_KEY as string
      sendgrid.setApiKey(sendgridApiKey);
      const result = await sendgrid.send(mailOption)
      if (result) return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
      console.error(error);
    }
  }

  return { success: false, message: 'Email type or something went wrong.' };
}