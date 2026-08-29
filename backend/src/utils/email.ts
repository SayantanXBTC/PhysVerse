import crypto from 'crypto';

const FROM = process.env.EMAIL_FROM || 'PhysVerse <noreply@physverse.local>';
const PROVIDER = (process.env.EMAIL_PROVIDER || '').toLowerCase();

// Sends via configured provider. Falls back to console log in dev if none configured.
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    if (PROVIDER === 'resend' && process.env.RESEND_API_KEY) {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from: FROM, to, subject, html })
      });
      if (!resp.ok) throw new Error(`Resend failed: ${resp.status} ${await resp.text()}`);
      return;
    }

    if (PROVIDER === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: FROM.replace(/.*<|>/g, '') || FROM, name: 'PhysVerse' },
          subject,
          content: [{ type: 'text/html', value: html }]
        })
      });
      if (!resp.ok) throw new Error(`SendGrid failed: ${resp.status} ${await resp.text()}`);
      return;
    }

    // Dev fallback
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 [DEV] Email skipped (no provider configured)');
      console.log('  To:', to, '| Subject:', subject);
    }
  } catch (err) {
    console.error('sendEmail error:', err);
    // Don't throw — email failure should not break signup flow
  }
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email: string, token: string, name: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to PhysVerse!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thanks for signing up! We're excited to have you explore the universe of physics simulations.</p>
          <p>Please verify your email address to get started:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} PhysVerse. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(email, 'Verify Your PhysVerse Account', html);
};

export const sendPasswordResetEmail = async (email: string, token: string, name: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for your PhysVerse account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} PhysVerse. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(email, 'Reset Your PhysVerse Password', html);
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #dc2626; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to PhysVerse!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Your email has been verified! You're all set to explore the fascinating world of physics simulations.</p>
          
          <h3>🚀 What you can do now:</h3>
          
          <div class="feature">
            <strong>🔬 Explore 31+ Simulations</strong>
            <p>From quantum mechanics to celestial dynamics</p>
          </div>
          
          <div class="feature">
            <strong>📊 Real-Time Data Charts</strong>
            <p>Visualize physics data as simulations run</p>
          </div>
          
          <div class="feature">
            <strong>💾 Save & Share</strong>
            <p>Create and share your own simulation configurations</p>
          </div>
          
          <div class="feature">
            <strong>🎓 Learn Physics</strong>
            <p>Interactive explanations and detailed information</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Exploring</a>
          </div>
          
          <p>Need help? Check out our <a href="${process.env.FRONTEND_URL}/docs">documentation</a> or reach out to support.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} PhysVerse. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail(email, 'Welcome to PhysVerse - Get Started!', html);
};
