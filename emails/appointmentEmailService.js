import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  //Enviar el email
  const info = await transporter.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "AppSalon - Nueva Cita",
    text: "AppSalon - Nueva Cita",
    html: `
        <h1>Hola Admin, Tienes una nueva cita</h1>
        <p>La cita será el día ${date} a las ${time}</p>
    
      `,
  });

  console.log("Message sent: %s", info.messageId);
}
export async function sendEmailUpdateAppointment({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  //Enviar el email
  const info = await transporter.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "AppSalon - Cita Actualizada",
    text: "AppSalon - Cita Actualizada",
    html: `
        <h1>Hola Admin, un usuario a modificado una cita. </h1>
        <p>La nueva cita será el día ${date} a las ${time}</p>
    
      `,
  });

  console.log("Message sent: %s", info.messageId);
}
export async function sendEmailCancelAppointment({ date, time }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  //Enviar el email
  const info = await transporter.sendMail({
    from: "AppSalon <citas@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "AppSalon - Cita Eliminada",
    text: "AppSalon - Cita Eliminada",
    html: `
        <h1>Hola Admin, un usuario a ELIMINADO su cita. </h1>
        <p>Del día ${date} a las ${time}</p>
    
      `,
  });

  console.log("Message sent: %s", info.messageId);
}
