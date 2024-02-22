import jwt from "jsonwebtoken";
import User from "../models/User.js";
const authMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select(
        "-password -__v -token  -verified"
      )
      next()
      
    } catch {
       const error = new Error("Tu token no es valido");
       res.status(403).json({ msg: error.message });
    }
  } else {
    console.log(" no hay token");
    const error = new Error("Token no valido o no existe");
    res.status(403).json({ msg: error.message });
  }
};

export default authMiddleware;
