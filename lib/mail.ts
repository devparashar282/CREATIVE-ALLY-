import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromAddress = smtpUser || "no-reply@creativeally.local";

const transporter = smtpHost && smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })
  : null;

type ReceiptPayload = {
  studentName: string;
  email: string;
  phone: string;
  countryCode: string;
  college: string;
  itemType: "course" | "internship";
  itemTitle: string;
  amount: number;
  orderId: string;
  paymentId: string;
  status: string;
};

async function safeSendMail(options: nodemailer.SendMailOptions) {
  if (!transporter) return false;

  try {
    await transporter.sendMail(options);
    return true;
  } catch (error) {
    console.error("Email sending failed", error);
    return false;
  }
}

export async function sendContactAdminEmail(input: {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  subject: string;
  message: string;
}) {
  const to = process.env.PAYMENT_ADMIN_EMAIL || process.env.PRIMARY_CONTACT_EMAIL;
  if (!to) return false;

  return safeSendMail({
    from: `Creative Ally <${fromAddress}>`,
    to,
    subject: `New Contact Message: ${input.subject}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.countryCode} ${input.phone}\n\n${input.message}`
  });
}

export async function sendAmbassadorEmail(input: {
  name: string;
  college: string;
  email: string;
  phone: string;
  countryCode: string;
}) {
  const to = process.env.PAYMENT_ADMIN_EMAIL || process.env.PRIMARY_CONTACT_EMAIL;
  if (!to) return false;

  return safeSendMail({
    from: `Creative Ally <${fromAddress}>`,
    to,
    subject: "New Campus Ambassador Application",
    text: `Name: ${input.name}\nCollege: ${input.college}\nEmail: ${input.email}\nPhone: ${input.countryCode} ${input.phone}`
  });
}

export async function sendPaymentReceiptEmails(payload: ReceiptPayload) {
  const from = `Creative Ally <${fromAddress}>`;
  const adminTo = process.env.PAYMENT_ADMIN_EMAIL || process.env.PRIMARY_CONTACT_EMAIL;

  const receiptText = [
    `Name: ${payload.studentName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.countryCode} ${payload.phone}`,
    `College: ${payload.college}`,
    `Enrollment: ${payload.itemType} - ${payload.itemTitle}`,
    `Amount: INR ${payload.amount}`,
    `Order ID: ${payload.orderId}`,
    `Payment ID: ${payload.paymentId}`,
    `Status: ${payload.status}`,
    "",
    "Thank you for choosing Creative Ally."
  ].join("\n");

  const jobs: Promise<boolean>[] = [
    safeSendMail({
      from,
      to: payload.email,
      subject: "Payment Receipt - Creative Ally",
      text: receiptText
    }),
    safeSendMail({
      from,
      to: payload.email,
      subject: "Welcome to Creative Ally - You are Officially Enrolled",
      text: `Dear ${payload.studentName},\n\nThank you for enrolling in our course at Creative Ally. We are thrilled to have you join our learning community.\n\nYour enrollment has been successfully processed.\n\nCourse/Internship Name: ${payload.itemTitle}\nPlatform: All classes will be conducted on Zoom\n\nWarm regards,\nTeam Creative Ally\ncreativeally2811@gmail.com`
    })
  ];

  if (adminTo) {
    jobs.push(
      safeSendMail({
        from,
        to: adminTo,
        subject: "New Paid Enrollment - Creative Ally",
        text: receiptText
      })
    );
  }

  await Promise.allSettled(jobs);
}

export async function sendPasswordResetEmail(input: {
  email: string;
  name?: string;
  resetLink: string;
}) {
  const from = `Creative Ally <${fromAddress}>`;
  const greeting = input.name?.trim() ? `Dear ${input.name.trim()},` : "Hello,";

  return safeSendMail({
    from,
    to: input.email,
    subject: "Reset your Creative Ally password",
    text: `${greeting}\n\nWe received a request to reset your Creative Ally account password.\n\nReset link: ${input.resetLink}\n\nThis link expires in 1 hour. If you did not request this, you can ignore this email.\n\nTeam Creative Ally`
  });
}
