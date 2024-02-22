import Services from "../models/Services.js";
import { validateObjectId, handleNotFoundError } from "../utils/index.js";

const createService = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios");

    return res.status(400).json({
      msg: error.message,
    });
  }
  try {
    const service = new Services(req.body);
    await service.save();
    res.json({ msg: "Servicio creado correctamente" });
  } catch (error) {
    console.log(error);
  }
};
const getServices = async (req, res) => {
  try {
    const services = await Services.find();
    res.json(services);
  } catch (error) {
    console.log(error);
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  //Validar un object ID
  if (validateObjectId(id, res)) return;

  //Validar que exista el servicio
  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError("El servició no existe", res);
  }

  //MOstrar el servicio
  res.json(service);
};

const updateService = async (req, res) => {
  const { id } = req.params;
  //Validar un object ID
  if (validateObjectId(id, res)) return;

  //Validar que exista el servicio
  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError("El servició no existe", res);
  }
  //Escribimos en el objeto los nuevos valores
  service.name = req.body.name || service.name;
  service.price = req.body.price || service.price;

  try {
    await service.save();
    res.json({ msg: "Servicio actualizado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  //Validar un object ID
  if (validateObjectId(id, res)) return;
  //Validar que exista el servicio
  const service = await Services.findById(id);
  if (!service) {
    return handleNotFoundError("El servició no existe", res);
  }
  try {
    await service.deleteOne();
    res.json({ msg: "Servicio eliminado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

export {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
