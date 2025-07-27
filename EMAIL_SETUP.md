# Email Setup Guide for Portfolio Contact Form

## Current Status
The contact form currently opens your email client with a pre-filled message. To enable direct email sending (so visitors can send emails directly to you without opening their email client), follow these steps:

## Option 1: EmailJS (Recommended - Free)

### Step 1: Sign up for EmailJS
1. Go to https://www.emailjs.com/
2. Create a free account
3. Verify your email address

### Step 2: Create an Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (or your preferred email provider)
4. Connect your Gmail account (maheep.mouli.shashi@gmail.com)
5. Note down the Service ID (e.g., "service_abc123")

### Step 3: Create an Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Template Name:** Portfolio Contact Form

**Subject:** Portfolio Contact: {{subject}}

**Content:**
```
Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website contact form.
```

4. Note down the Template ID (e.g., "template_xyz789")

### Step 4: Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your Public Key

### Step 5: Update the Contact Form
Replace the placeholder values in `src/components/Contact.tsx`:

```typescript
// Replace these with your actual EmailJS credentials
const serviceId = 'service_v72n6o2'; // Your EmailJS service ID
const templateId = 'template_uolamak '; // Your EmailJS template ID  
const publicKey = 'M9vUpeuScCKiup5j8'; // Your EmailJS public key
```

### Step 6: Uncomment EmailJS Code
In `src/components/Contact.tsx`, uncomment and update the EmailJS code:

```typescript
import emailjs from '@emailjs/browser';

// In the handleSubmit function, replace the mailto approach with:
const templateParams = {
  to_email: 'maheep.mouli.shashi@gmail.com',
  from_name: formData.name,
  from_email: formData.email,
  subject: formData.subject || 'Portfolio Contact',
  message: formData.message,
  reply_to: formData.email
};

const response = await emailjs.send(
  serviceId,
  templateId,
  templateParams,
  publicKey
);

if (response.status === 200) {
  toast({
    title: "Message Sent Successfully!",
    description: "Thank you for reaching out. I'll get back to you soon.",
  });
  setFormData({ name: '', email: '', subject: '', message: '' });
}
```

## Option 2: Netlify Forms (If hosting on Netlify)

If you're hosting on Netlify, you can use their built-in form handling:

1. Add `data-netlify="true"` to your form
2. Add a hidden input: `<input type="hidden" name="form-name" value="contact" />`
3. Netlify will automatically handle form submissions and send you emails

## Option 3: Vercel Serverless Function

Create a serverless function to handle email sending:

1. Create `api/send-email.js` in your project
2. Use a service like SendGrid or Nodemailer
3. Deploy to Vercel

## Testing

After setup:
1. Fill out the contact form
2. Submit the form
3. Check your email (maheep.mouli.shashi@gmail.com)
4. You should receive the message directly

## Security Notes

- EmailJS is safe for frontend use
- Your email credentials are not exposed to visitors
- All emails will be sent from your connected email account
- You can set up spam filtering in your email client

## Support

If you need help setting this up, the EmailJS documentation is very helpful: https://www.emailjs.com/docs/ 