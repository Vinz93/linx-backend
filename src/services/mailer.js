import mandrill from 'mandrill-api/mandrill';
import config from '../config/env';

const { mailer } = config;
const mandrillClient = new mandrill.Mandrill(mailer.key);

async function sendMailTemplate(name, email, templateName, templateContent) {
  const mailOpts = {
    template_name: templateName,
    template_content: templateContent || [],
    message: {
      from_name: mailer.from.name,
      from_email: mailer.from.email,
      to: [{
        name,
        email,
        type: 'to',
      }],
      merge_language: 'mailchimp',
    },
    async: true,
  };
  return await mandrillClient.messages.sendTemplate(mailOpts);
}

export async function sendForgotPassword(user) {
  return await sendMailTemplate(user.firstName, user.email, 'Linx Forgot Password');
}
