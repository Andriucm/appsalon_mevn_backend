import express from "express"; //Importar express -- ESM
import {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentsById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createAppointment) //Ruta para crear una cita
  .get(authMiddleware, getAppointmentsByDate); //Ruta para crear una cita

router
  .route("/:id")
  .get(authMiddleware, getAppointmentsById) //Ruta para obtener una cita por id
  .put(authMiddleware, updateAppointment) //Ruta para actualizar una cita por id
  .delete(authMiddleware, deleteAppointment); //Ruta para actualizar una cita por id

export default router; //Exportar el router
