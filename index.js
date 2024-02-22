import express from "express"; //Importar express -- ESM
import dotenv from "dotenv"; //Importar dotenv
import colors from "colors"; //Importar colors
import cors from "cors"; //Importar cors
import { db } from "./config/db.js";
import servicesRoutes from "./routes/servicesRoutes.js"; //Importar el archivo de rutas de servicios
import authRoutes from "./routes/authRoutes.js"; //Importar el archivo de rutas de autenticación
import appointmentsRoutes from "./routes/appointmentsRoutes.js"; //Importar el archivo de rutas de citas
import userRoutes from "./routes/userRoutes.js"; //Importar el archivo de rutas de usuarios

//Variables de entorno
dotenv.config();

//Configurar la aplicación
const app = express(); //Creando una instancia de express

//Leer los datos via body
app.use(express.json());

//Conectar a la base de datos
db();

// Configurar CORS
const whiteList = [process.env.FRONTEND_URL];

if (process.argv[2] === "--postman") {
  whiteList.push(undefined);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

//Definir una ruta
app.use("/api/services", servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/users", userRoutes);

//Definir un puerto
const PORT = process.env.PORT || 4000;
//Levantar el servidor
app.listen(PORT, () => {
  console.log(
    colors.blue.bgGreen.bold(`El servidor esta corriendo en el puerto`),
    colors.yellow.bold.bgYellow(PORT)
  );
});
