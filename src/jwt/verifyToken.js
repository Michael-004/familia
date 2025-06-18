import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // Asegúrate de que la variable JWT_SECRET esté definida en tu archivo de configuración

export const verifyToken = async (req, res, next) => {
    const usuario = req.headers['authorization'];
    const token = usuario && usuario.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ 
            message: "Token no proporcionado" 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_super_seguro');
        req.userId = decoded.id;
        req.userRol = decoded.rol;
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Token inválido o expirado" 
        });
    }
};
