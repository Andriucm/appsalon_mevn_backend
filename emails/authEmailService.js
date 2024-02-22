import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  //Enviar el email
  const info = await transporter.sendMail({
    from: "AppSalon <no-reply@appsalon.com>",
    to: email,
    subject: "AppSalon - Verifica tu email",
    text: "Haz click en el siguiente enlace para verificar tu email",
    html: `
        <h1>Hola ${name}</h1>
        <p> Haz click en el siguiente enlace para verificar tu email</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Verificar email</a>

        <p>Si no fuiste tú, ignora este mensaje <strong>Gracias</strong> </p>
        <p></p>
        <p>El equipo de AppSalon</p>
    
      `,
  });

  console.log("Message sent: %s", info.messageId);
}
export async function sendEmailPasswordReset({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  );

  //Enviar el email
  const info = await transporter.sendMail({
    from: "AppSalon <no-reply@appsalon.com>",
    to: email,
    subject: "AppSalon - Restablece tu contraseña",
    text: "AppSalon - Restablece tu contraseña",
    html: `
        <h1>Hola ${name}, has solicitado restablecer tu contraseña</h1>
        <p> Sigue el siguiente enlace para restablecer tu contraseña: </p>
        <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Haz click aquí para acceder al enlace</a>

        <p>Si no solicitaste esto, ignora este mensaje <strong>Gracias</strong> </p>
        <p></p>
        <p>El equipo de AppSalon</p>
    
      `,
  });

  console.log("Message sent: %s", info.messageId);
}
