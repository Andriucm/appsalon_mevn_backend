import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import Appointment from "../models/Appointment.js";
import {
  validateObjectId,
  handleNotFoundError,
  formatDate,
} from "../utils/index.js";
import {
  sendEmailNewAppointment,
  sendEmailUpdateAppointment,
  sendEmailCancelAppointment,
} from "../emails/appointmentEmailService.js";

const createAppointment = async (req, res) => {
  const appointment = req.body;
  appointment.user = req.user._id.toString();
  try {
    const newAppointment = await Appointment(appointment);
    const result = await newAppointment.save();

    //Enviar email
    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time,
    });

    res.json({
      msg: "Tu cita ha sido creada con éxito",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;
  const newDate = parse(date, "dd/MM/yyyy", new Date());
  if (!isValid(newDate)) {
    const error = new Error("Fecha no válida");

    return res.status(400).json({ msg: error.message });
  }
  const isoDate = formatISO(newDate);
  const appointments = await Appointment.find({
    date: {
      $gte: startOfDay(new Date(isoDate)),
      $lte: endOfDay(new Date(isoDate)),
    },
  }).select("time");

  res.json(appointments);
};

const getAppointmentsById = async (req, res) => {
  const { id } = req.params;
  //Validar por objectId
  if (validateObjectId(id, res)) return;

  //Validar que exista la cita
  const appointment = await Appointment.findById(id).populate("services");

  if (!appointment) {
    return handleNotFoundError("Cita no encontrada", res);
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes permisos para ver esta cita");
    return res.status(403).json({ msg: error.message });
  }

  //Devolver la cita
  res.json(appointment);
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  //Validar por objectId
  if (validateObjectId(id, res)) return;

  //Validar que exista la cita
  const appointment = await Appointment.findById(id).populate("services");

  if (!appointment) {
    return handleNotFoundError("Cita no encontrada", res);
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes permisos para ver esta cita");
    return res.status(403).json({ msg: error.message });
  }

  const { date, time, totalAmount, services } = req.body;
  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;
  try {
    const result = await appointment.save();
    res.json({
      msg: "Cita actualizada con éxito",
    });
    await sendEmailUpdateAppointment({
      date: formatDate(result.date),
      time: result.time,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  //Validar por objectId
  if (validateObjectId(id, res)) return;

  //Validar que exista la cita
  const appointment = await Appointment.findById(id).populate("services");

  if (!appointment) {
    return handleNotFoundError("Cita no encontrada", res);
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes permisos para ver esta cita");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await appointment.deleteOne();
    await sendEmailCancelAppointment({
      date: formatDate(appointment.date),
      time: appointment.time,
    });
    res.json({
      msg: "Cita cancelada con éxito",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentsById,
  updateAppointment,
  deleteAppointment,
};
