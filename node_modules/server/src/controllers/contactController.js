const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const nodemailer = require('nodemailer');

const sendContactEmail = async (messageDetails) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not set. Skipping contact form notification email.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Dhanish Travel Co." <${process.env.EMAIL_USER}>`,
      to: messageDetails.email,
      subject: `We received your inquiry: ${messageDetails.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0B2447;">Dhanish Travel Co.</h2>
          <p>Hi ${messageDetails.name},</p>
          <p>Thank you for reaching out to us. We have received your inquiry regarding "<strong>${messageDetails.subject}</strong>".</p>
          <p>Our team will review your message and get back to you within 24 business hours.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #F5A623; margin: 20px 0;">
            <strong>Your Message:</strong><br/>
            ${messageDetails.message}
          </div>
          <p>Regards,<br/>Dhanish Travel Co. Team</p>
        </div>
      `,
    });
    console.log(`Contact confirmation email sent to ${messageDetails.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send contact email:', error.message);
    return false;
  }
};

const sendReplyEmail = async (messageDetails, replyMessage) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not set. Skipping admin reply email.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Dhanish Travel Co." <${process.env.EMAIL_USER}>`,
      to: messageDetails.email,
      subject: `Re: ${messageDetails.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0B2447;">Dhanish Travel Co.</h2>
          <p>Hi ${messageDetails.name},</p>
          <p>Thank you for your inquiry regarding "<strong>${messageDetails.subject}</strong>".</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #F5A623; margin: 20px 0;">
            <strong>Our Response:</strong><br/>
            ${replyMessage}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Your original message:</p>
          <p style="color: #666; font-size: 12px;">${messageDetails.message}</p>
          <p>Regards,<br/>Dhanish Travel Co. Team</p>
        </div>
      `,
    });
    console.log(`Admin reply email sent to ${messageDetails.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send admin reply email:', error.message);
    return false;
  }
};

// @desc    Create a contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const newMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
    status: 'pending',
  });

  // Async send email (don't block HTTP response)
  sendContactEmail(newMessage);

  res.status(201).json({
    success: true,
    data: newMessage,
    message: 'Message sent successfully. We will get back to you shortly.',
  });
});

// @desc    Get logged-in user's contact inquiries & admin replies
// @route   GET /api/contact/my-inquiries
// @access  Private
const getMyContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({ email: req.user.email.toLowerCase() })
    .sort({ createdAt: -1 })
    .select('subject message status adminReply repliedAt createdAt');

  res.status(200).json({
    success: true,
    data: messages,
  });
});

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: messages,
  });
});

// @desc    Update contact message status (admin only)
// @route   PATCH /api/contact/:id
// @access  Private/Admin
const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const { status, replyMessage } = req.body;
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (replyMessage && replyMessage.trim()) {
    message.adminReply = replyMessage.trim();
    message.repliedAt = new Date();
    message.status = 'replied';
    await sendReplyEmail(message, replyMessage.trim());
  } else if (status) {
    message.status = status;
  }

  const updatedMessage = await message.save();

  res.status(200).json({
    success: true,
    data: updatedMessage,
    message: replyMessage
      ? 'Reply saved and sent to customer successfully.'
      : 'Message status updated successfully',
  });
});

// @desc    Delete contact message (admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await ContactMessage.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
});

module.exports = {
  createContactMessage,
  getMyContactMessages,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};
