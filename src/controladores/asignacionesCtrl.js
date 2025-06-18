import {conmysql} from '../db.js'

export const getAsignaciones = async (req, res) => {
    try {
        const [result] = await conmysql.query(
        `CALL obtener_asignaciones_con_actualizacion(?)`,
        [req.params.id]
        );
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({message: "Error al consultar asignaciones"})
    }
}

export const AsignacionesEstado = async (req, res) => {
    try {
        const [result] = await conmysql.query(
        `CALL actualizar_estado_asignacion(?)`,
        [req.params.id]
        );
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({message: "Error al consultar asignaciones"})
    }
}

export const getAsignacionxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Asignaciones WHERE IdAsignacion = ?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            IdAsignacion: 0,
            message: "Asignación no encontrada"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: 'Error de lado del servidor'})        
    }
}

export const postAsignacion = async (req, res) => {
    try {
        const {IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado, FechaCompletada} = req.body
        const [rows] = await conmysql.query(
            'INSERT INTO Asignaciones (IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado, FechaCompletada) VALUES (?, ?, ?, ?, ?, ?)',
            [IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado || 'Pendiente', FechaCompletada]
        )
        res.status(201).json({
            id: rows.insertId,
            Estado: Estado || 'Pendiente'
        })
    } catch(error) {
        return res.status(500).json({message: 'Error al crear asignación'})
    }
}

export const putAsignacion = async (req, res) => {
    try {
        const {id} = req.params
        const {IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado, FechaCompletada} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Asignaciones SET IdTarea = ?, IdUsuario = ?, FechaAsignacion = ?, FechaLimite = ?, Estado = ?, FechaCompletada = ? WHERE IdAsignacion = ?',
            [IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado, FechaCompletada, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Asignación no encontrada"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Asignaciones WHERE IdAsignacion = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar asignación'})
    }
}

export const patchAsignacion = async (req, res) => {
    try {
        const {id} = req.params
        const {IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado, FechaCompletada} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Asignaciones SET ' +
            'IdTarea = IFNULL(?, IdTarea), ' +
            'IdUsuario = IFNULL(?, IdUsuario), ' +
            'FechaAsignacion = IFNULL(?, FechaAsignacion), ' +
            'FechaLimite = IFNULL(?, FechaLimite), ' +
            'Estado = IFNULL(?, Estado), ' +
            'FechaCompletada = IFNULL(?, FechaCompletada) ' +
            'WHERE IdAsignacion = ?',
            [IdTarea, IdUsuario, FechaAsignacion, FechaLimite, Estado, FechaCompletada, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Asignación no encontrada"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Asignaciones WHERE IdAsignacion = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar asignación'})
    }
}

export const deleteAsignacion = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM Asignaciones WHERE IdAsignacion = ?', [req.params.id])
        if (rows.affectedRows <= 0) return res.status(404).json({
            id: 0,
            message: 'No se pudo eliminar la asignación'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Error de lado del servidor"
        })
    }
}