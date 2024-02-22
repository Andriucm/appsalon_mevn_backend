import User from "../models/User.js";
import {
  sendEmailVerification,
  sendEmailPasswordReset,
} from "../emails/authEmailService.js";
import { generateJWT, uniqueId } from "../utils/index.js";

const register = async (req, res) => {
  //Validar que no haya campos vacíos
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");
    return res.status(400).json({ msg: error.message });
  }

  const { name, email, password } = req.body;
  //Evitar campos duplicados
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  //Validar la extensión del password
  const MIN_PASSWORD_LENGTH = 8;
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      `El password debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
    );
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    const result = await user.save();
    const { name, email, token } = result;
    sendEmailVerification({ name, email, token });

    res.json({ msg: "Usuario registrado correctamente, revisa tu email" });
  } catch (error) {
    console.log(error);
  }
};
const verifyAccount = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("El token no es valido o ha expirado");
    return res.status(401).json({ msg: error.message });
  }
  try {
    Object.assign(user, { verified: true, token: "" });
    await user.save();
    res.json({ msg: "Usuario verificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  //Revisar si el usuario existe
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Cuenta de usuario o contraseña incorrecta");
    return res.status(401).json({ msg: error.message });
  }

  //Revisar si el usuario confirmó su email
  if (!user.verified) {
    const error = new Error("Tu cuenta aún no ha sido verificada");
    return res.status(401).json({ msg: error.message });
  }
  //Revisar si el password es correcto
  if (await user.checkPassword(password)) {
    const token = generateJWT(user._id);
    res.json({
      token,
    });
  } else {
    const error = new Error("Cuenta de usuario o contraseña incorrectas");
    return res.status(401).json({ msg: error.message });
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  //Comprobar si existe el usuario
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = uniqueId();
    const result = await user.save();

    await sendEmailPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token,
    });
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;
  const isValidToken = await User.findOne({ token });
  if (!isValidToken) {
    const error = new Error("El token no es válido o ha expirado");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "Token válido" });
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("El token no es válido o ha expirado");
    return res.status(400).json({ msg: error.message });
  }


  const { password } = req.body;
  try {
    user.token = "";
    user.password = password;
    await user.save();
    res.json({ msg: "Contraseña actualizado correctamente" });
  } catch (error) {
    console.log(error);
  }
};
const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const admin = async (req, res) => {
  const { user } = req;
  if(!user.admin){
    const error = new Error("Acción no autorizada");
    return res.status(403).json({ msg: error.message });
  }
  
  res.json(user);
};


export {
  register,
  verifyAccount,
  login,
  user,
  admin,
  forgotPassword,
  verifyPasswordResetToken,
  resetPassword,
};
