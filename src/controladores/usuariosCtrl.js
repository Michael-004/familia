import {conmysql} from '../db.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Usuarios')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message: "Error al consultar usuarios"})
    }
}

export const getUsuarioxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            IdUsuario: 0,
            message: "Usuario no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: 'Error de lado del servidor'})        
    }
}

export const postUsuario = async (req, res) => {
    try {
        const {IdFamilia, IdRol, Nombre, Correo, Contrasena} = req.body
        console.log(req.body);
         const salt = await bcrypt.genSalt(10);
        const contrasenaHash = await bcrypt.hash(Contrasena, salt);
        const [result] = await conmysql.query(
            'INSERT INTO Usuarios(IdFamilia, IdRol, Nombre, Correo, Contrasena) values(?, ?, ?, ?, ?)',
            [IdFamilia, IdRol, Nombre, Correo, Contrasena, contrasenaHash]);
        res.send({id:result.insertId,})
    } catch(error) {
        return res.status(500).json({message: 'Error al crear usuario',
            error: error.message,
        })
    }
}

export const login = async (req, res) => {
    try {
        const { Correo, Contrasena } = req.body;
        
        // Validacion del correo y contraseña
        if (!Correo || !Contrasena) {
            return res.status(400).json({ 
                message: "Correo y contraseña son requeridos" 
            });
        }

        // Buscar usuario
        const [rows] = await conmysql.query(
            'SELECT * FROM Usuarios WHERE Correo = ?', [Correo]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const usuario = rows[0];
        let contrasenaValida = false;

        // Verificar contraseña tanto que este hasheada como no hasheada
        if (usuario.Contrasena.startsWith('$2b$')) {
            contrasenaValida = await bcrypt.compare(Contrasena, usuario.Contrasena);
        } else {
            contrasenaValida = Contrasena === usuario.Contrasena;
            
            // Si la contraseña no estaba hasheada, hashearla ahora
            if (contrasenaValida) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(Contrasena, salt);
                await conmysql.query(
                    'UPDATE Usuarios SET Contrasena = ? WHERE IdUsuario = ?',
                    [hash, usuario.IdUsuario]
                );
            }
        }

        if (!contrasenaValida) {
            return res.status(401).json({ 
                message: "Credenciales inválidas" 
            });
        }

        // Generar token
        const token = jwt.sign(
            { 
                id: usuario.IdUsuario, 
                rol: usuario.IdRol,
                familia: usuario.IdFamilia
            },
            process.env.JWT_SECRET || 'tu_secreto_super_seguro',
            { expiresIn: '1h' }
        );

         // Enviar el token y el id del usuario en la respuesta
        res.status(200).json({ auth: true, token, IdUsuario: usuario.IdUsuario });
        
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ 
            message: "Error al iniciar sesión",
            error: error.message 
        });
    }
};

export const putUsuario = async (req, res) => {
    try {
        const {id} = req.params
        const {IdFamilia, IdRol, Nombre, Correo, Contrasena} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Usuarios SET IdFamilia = ?, IdRol = ?, Nombre = ?, Correo = ?, Contrasena = ? WHERE IdUsuario = ?',
            [IdFamilia, IdRol, Nombre, Correo, Contrasena, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Usuario no encontrado"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar usuario'})
    }
}

export const patchUsuario = async (req, res) => {
    try {
        const {id} = req.params
        const {IdFamilia, IdRol, Nombre, Correo, Contrasena} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Usuarios SET IdFamilia = IFNULL(?, IdFamilia),IdRol = IFNULL(?, IdRol), Nombre = IFNULL(?, Nombre), Correo = IFNULL(?, Correo), Contrasena = IFNULL(?, Contrasena) WHERE IdUsuario = ?',
            [IdFamilia, IdRol, Nombre, Correo, Contrasena, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Usuario no encontrado"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar usuario'})
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [req.params.id])
        if (rows.affectedRows <= 0) return res.status(404).json({
            id: 0,
            message: 'No se pudo eliminar el usuario'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Error de lado del servidor"
        })
    }
}