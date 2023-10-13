const client = require('@sendgrid/mail');

class CreateEmailRequest {
   personalizations: any[] = [];
   from: { email: string | null; name: string | null } | string = '';
   subject: string = '';
   content: any[] = [];
   reply_to_list!: { email?: string | undefined; name?: string | undefined }[];
   attachments!: {
      // The Base64 encoded content of the attachment.
      content: any;
      // The MIME type of the content you are attaching (e.g., “text/plain” or “text/html”).
      type: any;
      // The attachment's filename
      filename: any;
      // The attachment's content-disposition, specifying how you would like the attachment to be displayed.
      // For example, “inline” results in the attached file are displayed automatically within the message while “attachment” results in the attached file require some action to be taken before it is displayed, such as opening or downloading the file.
      // default: attachment, Allowed Values: inline, attachment
      disposition: any;
      // The attachment's content ID. This is used when the disposition is set to “inline” and the attachment is an image, allowing the file to be displayed within the body of your email.
      content_id: any;
   }[];
   template_id!: any;
   headers!: any;
   categories!: any;
   custom_args!: any;
   send_at!: any;
   batch_id!: any;
   asm!: {
      // The unsubscribe group to associate with this email.
      group_id: string;
      // An array containing the unsubscribe groups that you would like to be displayed on the unsubscribe preferences page.
      groups_to_display: never[];
   };
   ip_pool_name!: any;
   mail_settings!: {
      // Allows you to bypass all unsubscribe groups and suppressions to ensure that the email is delivered to every single recipient.
      // This should only be used in emergencies when it is absolutely necessary that every recipient receives your email.
      // This filter cannot be combined with any other bypass filters.
      bypass_list_management: { enable: boolean };
      // llows you to bypass the spam report list to ensure that the email is delivered to recipients.
      // Bounce and unsubscribe lists will still be checked; addresses on these other lists will not receive the message.
      // This filter cannot be combined with the bypass_list_management filter.
      bypass_spam_management: { enable: boolean };
      // Allows you to bypass the bounce list to ensure that the email is delivered to recipients.
      // Spam report and unsubscribe lists will still be checked; addresses on these other lists will not receive the message.
      // This filter cannot be combined with the bypass_list_management filter.
      bypass_bounce_management: { enable: boolean };
      // Allows you to bypass the global unsubscribe list to ensure that the email is delivered to recipients.
      // Bounce and spam report lists will still be checked; addresses on these other lists will not receive the message.
      // This filter applies only to global unsubscribes and will not bypass group unsubscribes.
      // This filter cannot be combined with the bypass_list_management filter.
      bypass_unsubscribe_management: { enable: boolean };
      // The default footer that you would like included on every email.
      footer: { enable: boolean; text: string; html: string };
      // Sandbox Mode allows you to send a test email to ensure that your request body is valid and formatted correctly.
      sandbox_mode: { enable: boolean };
   };
   tracking_settings!: {
      // Allows you to track if a recipient clicked a link in your email.
      click_tracking: {
         // Indicates if this setting is enabled.
         enable: boolean;
         // Indicates if this setting should be included in the text/plain portion of your email.
         enable_text: boolean;
      };
      // Allows you to track if the email was opened by including a single pixel image in the body of the content. When the pixel is loaded, Twilio SendGrid can log that the email was opened.
      open_tracking: {
         // Indicates if this setting is enabled.
         enable: boolean;
         // Allows you to specify a substitution tag that you can insert in the body of your email at a location that you desire. This tag will be replaced by the open tracking pixel.
         substitution_tag: string;
      };
      // Allows you to insert a subscription management link at the bottom of the text and HTML bodies of your email. If you would like to specify the location of the link within your email, you may use the substitution_tag.
      subscription_tracking: {
         // Indicates if this setting is enabled.
         enable: boolean;
         // Text to be appended to the email with the subscription tracking link. You may control where the link is by using the tag <% %>
         text: string;
         // HTML to be appended to the email with the subscription tracking link. You may control where the link is by using the tag <% %>
         html: string;
         // A tag that will be replaced with the unsubscribe URL. for example: [unsubscribe_url]. If this parameter is used, it will override both the text and html parameters. The URL of the link will be placed at the substitution tag’s location with no additional formatting.
         substitution_tag: any;
      };
      ganalytics: {
         enable: boolean;
         utm_source: string;
         utm_medium: string;
         utm_term: string;
         utm_content: string;
         utm_campaign: string;
      };
   };

   constructor() {
      this.personalizations = [];
      this.from = '';
      this.subject = '';
      this.content = [];
   }

   // An array of messages and their metadata. Each object within personalizations can be thought of as an envelope
   // - it defines who should receive an individual message and how that message should be handled.
   // maxItems: 1000
   setPersonalizations(recipients: string[]) {
      if (!recipients.length) {
         throw { code: 400, message: 'Recipients cannot be empty' };
      }
      if (recipients.length > 1000) {
         throw { code: 400, message: 'Recipients cannot be larger than 1000' };
      }
      if (!Array.isArray(recipients)) {
         throw { code: 400, message: 'Must be an array' };
      }

      this.personalizations =
         recipients?.map((envelope: any) => {
            const {
               to_email,
               to_name = null,
               from_email = null,
               from_name = null,
               cc_email = null,
               cc_name = null,
               bcc_email = null,
               bcc_name = null,
               subject = null,
               substitutions = null,
               headers = null,
               custom_args = null,
               send_at = null,
            } = envelope;

            const newEnvelope: any = {};
            // The intended recipient's email address and name.
            if (to_email || to_name) {
               newEnvelope.to = {};
               to_email ? (newEnvelope.to.email = to_email) : null;
               to_name ? (newEnvelope.to.name = to_name) : null;
            }

            // The 'From' email address used to deliver the message. This address should be a verified sender in your Twilio SendGrid account.
            if (from_email || from_name) {
               newEnvelope.from = {};
               from_email ? (newEnvelope.from.email = from_email) : null;
               from_name ? (newEnvelope.from.name = from_name) : null;
            }

            // An array of recipients who will receive a copy of your email. Each object in this array must contain the recipient's email address. Each object in the array may optionally contain the recipient's name.
            // maxItems: 1000
            if (cc_email || cc_name) {
               newEnvelope.cc = {};
               cc_email ? (newEnvelope.cc.email = cc_email) : null;
               cc_name ? (newEnvelope.cc.name = cc_name) : null;
            }

            // An array of recipients who will receive a blind carbon copy of your email. Each object in this array must contain the recipient's email address. Each object in the array may optionally contain the recipient's name.
            // maxItems: 1000
            if (bcc_email || bcc_name) {
               newEnvelope.cc = {};
               bcc_email ? (newEnvelope.cc.email = bcc_email) : null;
               bcc_name ? (newEnvelope.cc.name = bcc_name) : null;
            }

            // The subject of your email.
            if (subject) {
               newEnvelope.subject = subject;
            }

            // This field is a collection of key/value pairs following the pattern "substitution_tag":"value to substitute". The key/value pairs must be strings.
            // These substitutions will apply to the text and html content of the body of your email, in addition to the subject and reply-to parameters.
            // The total collective size of your substitutions may not exceed 10,000 bytes per personalization object.
            if (substitutions && Object.keys(substitutions).length) {
               newEnvelope.substitutions = { ...substitutions };
            }

            // collection of JSON key/value pairs allowing you to specify handling instructions for your email.
            // You may not overwrite the following headers: x-sg-id, x-sg-eid, received, dkim-signature, Content-Type, Content-Transfer-Encoding, To, From, Subject, Reply-To, CC, BCC
            if (headers && Object.keys(headers).length) {
               newEnvelope.headers = { ...headers };
            }

            // Values that are specific to this personalization that will be carried along with the email and its activity data.
            // Substitutions will not be made on custom arguments, so any string that is entered into this parameter will be assumed to be the custom argument that you would like to be used.
            // This field may not exceed 10,000 bytes.
            if (custom_args && Object.keys(custom_args).length) {
               newEnvelope.custom_args = { ...custom_args };
            }

            // A unix timestamp allowing you to specify when your email should be delivered.
            // Scheduling delivery more than 72 hours in advance is forbidden.
            if (send_at) {
               newEnvelope.send_at = send_at;
            }

            return newEnvelope;
         }) || [];

      return this;
   }

   // The 'From' email address used to deliver the message. This address should be a verified sender in your Twilio SendGrid account.
   setFrom(from_email: string | { email: string }, from_name: string) {
      if (from_email || from_name) {
         this.from = { email: null, name: null };
         if (typeof from_email !== 'string') {
            this.from.email = from_email.email;
         } else {
            this.from.email = from_email;
         }
         this.from.name = from_name || null;
      }

      return this;
   }

   // An array of recipients who will receive replies and/or bounces. Each object in this array must contain the recipient's email address. Each object in the array may optionally contain the recipient's name.
   // maxItems: 1000, uniqueItems: True
   setReplyToList(replyToList: { email?: string; name?: string }[]) {
      this.reply_to_list = replyToList.map((reply) => {
         const replyTo: { email?: string; name?: string } = {};
         if (typeof reply === 'string') {
            replyTo.email = reply;
         } else {
            reply.email ? (replyTo.email = reply.email) : null;
            reply.name ? (replyTo.name = reply.name) : null;
         }
         return replyTo;
      });
      return this;
   }

   // The global or 'message level' subject of your email. This may be overridden by subject lines set in personalizations.
   setSubject(subject: string) {
      this.subject = subject;
      return this;
   }

   setContent(type: any, value: any) {
      const index = this.content.findIndex((content) => content.type === type);

      if (index === -1) {
         this.content.push({ type: type, value: value });
      } else {
         this.content[index].value = value;
      }
      return this;
   }

   setText(text: any) {
      const index = this.content.findIndex((content) => content.type === 'text/plain');

      if (index === -1) {
         this.content.push({ type: 'text/plain', value: text });
      } else {
         this.content[index].value = text;
      }
      return this;
   }

   setHtml(html: any) {
      const index = this.content.findIndex((content) => content.type === 'text/html');

      if (index === -1) {
         this.content.push({ type: 'text/html', value: html });
      } else {
         this.content[index].value = html;
      }
      return this;
   }

   // An array of objects where you can specify any attachments you want to include.
   addAttachment(attachment: any) {
      this.attachments = [
         {
            // The Base64 encoded content of the attachment.
            content: attachment.content,
            // The MIME type of the content you are attaching (e.g., “text/plain” or “text/html”).
            type: attachment.type,
            // The attachment's filename
            filename: attachment.filename,
            // The attachment's content-disposition, specifying how you would like the attachment to be displayed.
            // For example, “inline” results in the attached file are displayed automatically within the message while “attachment” results in the attached file require some action to be taken before it is displayed, such as opening or downloading the file.
            // default: attachment, Allowed Values: inline, attachment
            disposition: attachment.disposition,
            // The attachment's content ID. This is used when the disposition is set to “inline” and the attachment is an image, allowing the file to be displayed within the body of your email.
            content_id: attachment.content_id,
         },
      ];

      return this;
   }

   // An email template ID. A template that contains a subject and content — either text or html — will override any subject and content values specified at the personalizations or message level.
   setTemplate(template_id: any) {
      this.template_id = template_id;
      return this;
   }

   // An object containing key/value pairs of header names and the value to substitute for them. The key/value pairs must be strings.
   // You must ensure these are properly encoded if they contain unicode characters. These headers cannot be one of the reserved headers.
   setHeaders(headers: any) {
      this.headers = { ...headers };

      return this;
   }

   // An array of category names for this message. Each category name may not exceed 255 characters.
   // maxItems: 10, uniqueItems: True
   setCategories(categories: any) {
      // console.log(categories)

      // let tempCategories = null
      // // get input type
      // const type = Array.isArray(categories) ? 'array' : typeof categories

      // console.log(type, categories)
      // switch (type) {
      //   case 'string':
      //     tempCategories = this.categories ? [...this.categories, categories] : [categories]
      //     break;
      //   case 'array':
      //     tempCategories = this.categories ? [...this.categories, ...categories] : categories
      //     break;

      //   default:
      //     throw 'Mail-Send Error: setCategories must be string or array or strings. 10 strings max.'
      // }

      // // Make sure the array is not greater than 10
      // if (tempCategories.length > 10) {
      //   throw 'Mail-Send Error: setCategories must be array of 10 strings max.'
      // }
      // console.log(tempCategories);
      // // Make sure each array element is a string
      // tempCategories.forEach(element => {
      //   if (typeof element !== 'string') { throw 'Mail-Send Error: setCategories must be array of strings' }
      // });

      // this.categories = tempCategories
      this.categories = categories;
      return this;
   }

   // Values that are specific to the entire send that will be carried along with the email and its activity data. Key/value pairs must be strings.
   // Substitutions will not be made on custom arguments, so any string that is entered into this parameter will be assumed to be the custom argument that you would like to be used.
   // This parameter is overridden by custom_args set at the personalizations level. Total custom_args size may not exceed 10,000 bytes.
   setCustomArgs(custom_args: any) {
      this.custom_args = custom_args;

      return this;
   }

   // A unix timestamp allowing you to specify when you want your email to be delivered. This may be overridden by the send_at parameter set at the personalizations level.
   // Delivery cannot be scheduled more than 72 hours in advance. If you have the flexibility, it's better to schedule mail for off-peak times. Most emails are scheduled and sent at the top of the hour or half hour.
   // Scheduling email to avoid peak times — for example, scheduling at 10:53 — can result in lower deferral rates due to the reduced traffic during off-peak times.
   setSendAt(sendAt: any) {
      this.send_at = sendAt;

      return this;
   }

   // An ID representing a batch of emails to be sent at the same time. Including a batch_id in your request allows you include this email in that batch.
   // It also enables you to cancel or pause the delivery of that batch. For more information, see the Cancel Scheduled Sends API.
   setBatchId(batch_id: any) {
      this.batch_id = batch_id;

      return this;
   }

   // An object allowing you to specify how to handle unsubscribes.
   setAsm(asm: any) {
      this.asm = {
         // The unsubscribe group to associate with this email.
         group_id: '',
         // An array containing the unsubscribe groups that you would like to be displayed on the unsubscribe preferences page.
         groups_to_display: [],
      };

      return this;
   }

   // The IP Pool that you would like to send this email from.
   setIpPool(ip_pool_name: any) {
      this.ip_pool_name = ip_pool_name;

      return this;
   }

   // A collection of different mail settings that you can use to specify how you would like this email to be handled.
   setMailSettings() {
      this.mail_settings = {
         // Allows you to bypass all unsubscribe groups and suppressions to ensure that the email is delivered to every single recipient.
         // This should only be used in emergencies when it is absolutely necessary that every recipient receives your email.
         // This filter cannot be combined with any other bypass filters.
         bypass_list_management: {
            enable: false,
         },
         // llows you to bypass the spam report list to ensure that the email is delivered to recipients.
         // Bounce and unsubscribe lists will still be checked; addresses on these other lists will not receive the message.
         // This filter cannot be combined with the bypass_list_management filter.
         bypass_spam_management: {
            enable: false,
         },
         // Allows you to bypass the bounce list to ensure that the email is delivered to recipients.
         // Spam report and unsubscribe lists will still be checked; addresses on these other lists will not receive the message.
         // This filter cannot be combined with the bypass_list_management filter.
         bypass_bounce_management: {
            enable: false,
         },
         // Allows you to bypass the global unsubscribe list to ensure that the email is delivered to recipients.
         // Bounce and spam report lists will still be checked; addresses on these other lists will not receive the message.
         // This filter applies only to global unsubscribes and will not bypass group unsubscribes.
         // This filter cannot be combined with the bypass_list_management filter.
         bypass_unsubscribe_management: {
            enable: false,
         },
         // The default footer that you would like included on every email.
         footer: {
            enable: false,
            text: '',
            html: '',
         },
         // Sandbox Mode allows you to send a test email to ensure that your request body is valid and formatted correctly.
         sandbox_mode: {
            enable: false,
         },
      };

      return this;
   }

   // Settings to determine how you would like to track the metrics of how your recipients interact with your email.
   setTrackingSettings() {
      this.tracking_settings = {
         // Allows you to track if a recipient clicked a link in your email.
         click_tracking: {
            // Indicates if this setting is enabled.
            enable: true,
            // Indicates if this setting should be included in the text/plain portion of your email.
            enable_text: true,
         },
         // Allows you to track if the email was opened by including a single pixel image in the body of the content. When the pixel is loaded, Twilio SendGrid can log that the email was opened.
         open_tracking: {
            // Indicates if this setting is enabled.
            enable: true,
            // Allows you to specify a substitution tag that you can insert in the body of your email at a location that you desire. This tag will be replaced by the open tracking pixel.
            substitution_tag: '',
         },
         // Allows you to insert a subscription management link at the bottom of the text and HTML bodies of your email. If you would like to specify the location of the link within your email, you may use the substitution_tag.
         subscription_tracking: {
            // Indicates if this setting is enabled.
            enable: true,
            // Text to be appended to the email with the subscription tracking link. You may control where the link is by using the tag <% %>
            text: '',
            // HTML to be appended to the email with the subscription tracking link. You may control where the link is by using the tag <% %>
            html: '',
            // A tag that will be replaced with the unsubscribe URL. for example: [unsubscribe_url]. If this parameter is used, it will override both the text and html parameters. The URL of the link will be placed at the substitution tag’s location with no additional formatting.
            substitution_tag: null,
         },
         ganalytics: {
            enable: false,
            utm_source: '',
            utm_medium: '',
            utm_term: '',
            utm_content: '',
            utm_campaign: '',
         },
      };

      return this;
   }

   async send() {
      client.setApiKey(process.env.SENDGRID_API_KEY);

      return await client
         .send(this)
         .then((res: any) => {
            console.log('Mail sent successfully:', res[0].headers['x-message-id']);
            return res[0].headers['x-message-id'];
         })
         .catch((err: any) => {
            console.error(`${err}`);
            throw err;
         });
   }
}

// module.exports.createEmail = new CreateEmailRequest();

export const createEmail = new CreateEmailRequest();

/**
 * TODOS:
 * https://github.com/sendgrid/sendgrid-nodejs/blob/main/packages/client/USAGE.md
 * 1. On behalf of sub users
 * 2. Whitelist IPs
 *    Add/remove
 * 3. Alerts: specify an email address to receive notifications regarding your email usage or statistics.
 *    usage_limit: allows you to set the threshold at which an alert will be sent.
 *    stats_notification: allows you to set how frequently you would like to receive email statistics reports. For example, "daily", "weekly", or "monthly".
 * 4. ASM/supopression/unsubscribe groups
 *    specific types or categories of email that you would like your recipients to be able to unsubscribe from.
 *    The name and description of the unsubscribe group will be visible by recipients when they are managing their subscriptions.
 *    up to 25 different suppression groups
 * 5. Statistics
 * 6. Campaigns
 * 7. Categories
 *    organize your email analytics by enabling you to tag emails by type or broad topic.
 */
