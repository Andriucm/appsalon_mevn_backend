import express from "express";
import {
  register,
  verifyAccount,
  login,
  user,
  admin,
  forgotPassword,
  resetPassword,
  verifyPasswordResetToken,
} from "../controllers/authController.js"; //Importar los controladores de autenticación
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Rutas de autenticación y registro de usuarios
router.post("/register", register);
router.get("/verify/:token", verifyAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router
  .route("/forgot-password/:token")
  .get(verifyPasswordResetToken)
  .post(resetPassword);

//Area privada - Requiere un JWT válido
router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, admin);

export default router;
