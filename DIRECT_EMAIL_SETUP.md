# Direct Email Setup Guide

## Problem
Currently, the contact form opens your email client (Outlook) instead of sending emails directly to you. Here's how to fix this:

## Solution 1: Formspree (Recommended - Free & Easy)

### Step 1: Sign up for Formspree
1. Go to https://formspree.io/
2. Click "Get Started" and create a free account
3. Verify your email address

### Step 2: Create a Form
1. In your Formspree dashboard, click "New Form"
2. Name it "Portfolio Contact Form"
3. Copy the form endpoint (looks like `https://formspree.io/f/xayzabc123`)

### Step 3: Update the Code
Replace the placeholder in `src/components/Contact.tsx`:

```typescript
// Replace this line:
const formEndpoint = 'https://formspree.io/f/xwpqojby'; // Replace with your Formspree endpoint

// With your actual endpoint:
const formEndpoint = 'https://formspree.io/f/xwpqojby';
```

### Step 4: Test
1. Fill out the contact form
2. Submit it
3. Check your email - you should receive the message directly!

## Solution 2: EmailJS (Alternative)

### Step 1: Sign up for EmailJS
1. Go to https://www.emailjs.com/
2. Create a free account
3. Verify your email

### Step 2: Create Email Service
1. Go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" and connect your Gmail account
4. Note the Service ID

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Create new template with this content:

**Subject:** Portfolio Contact: {{subject}}

**Content:**
```
Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website.
```

### Step 4: Update Code
Replace the EmailJS code in `src/components/Contact.tsx`:

```typescript
import emailjs from '@emailjs/browser';

// Replace these with your actual credentials:
const serviceId = 'service_v72n6o2';
const templateId = 'service_v72n6o2';
const publicKey = 'M9vUpeuScCKiup5j8';
```

## Solution 3: Netlify Forms (If hosting on Netlify)

If you're hosting on Netlify, simply add this to your form:

```html
<form data-netlify="true" name="contact">
  <input type="hidden" name="form-name" value="contact" />
  <!-- rest of your form fields -->
</form>
```

Netlify will automatically handle form submissions and send you emails.

## Solution 4: Vercel Serverless Function

Create `api/contact.js` in your project:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Use a service like SendGrid, Nodemailer, or Resend
  // to send the email to maheep.mouli.shashi@gmail.com

  res.status(200).json({ message: 'Email sent successfully' });
}
```

## Current Status
The form currently has a fallback that opens your email client. Once you set up one of the above solutions, it will send emails directly to you without opening any email client.

## Testing
After setup:
1. Fill out the contact form
2. Submit it
3. Check your email (maheep.mouli.shashi@gmail.com)
4. You should receive the message directly in your inbox

## Recommendation
I recommend **Formspree** as it's:
- Free for up to 50 submissions/month
- No setup required
- Works immediately
- Sends emails directly to your inbox 