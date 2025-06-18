import {conmysql} from '../db.js'

export const getRecompensas = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Recompensas')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message: "Error al consultar recompensas"})
    }
}

export const getRecompensaxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Recompensas WHERE IdRecompensa = ?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            IdRecompensa: 0,
            message: "Recompensa no encontrada"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: 'Error de lado del servidor'})        
    }
}

export const postRecompensa = async (req, res) => {
    try {
        const {IdFamilia, Nombre, Descripcion, PuntosNecesarios} = req.body
        const [rows] = await conmysql.query(
            'INSERT INTO Recompensas (IdFamilia, Nombre, Descripcion, PuntosNecesarios) VALUES (?, ?, ?, ?)',
            [IdFamilia, Nombre, Descripcion, PuntosNecesarios]
        )
        res.status(201).json({
            id: rows.insertId,
            Nombre,
            PuntosNecesarios
        })
    } catch(error) {
        return res.status(500).json({message: 'Error al crear recompensa'})
    }
}

export const putRecompensa = async (req, res) => {
    try {
        const {id} = req.params
        const {IdFamilia, Nombre, Descripcion, PuntosNecesarios} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Recompensas SET IdFamilia = ?, Nombre = ?, Descripcion = ?, PuntosNecesarios = ? WHERE IdRecompensa = ?',
            [IdFamilia, Nombre, Descripcion, PuntosNecesarios, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Recompensa no encontrada"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Recompensas WHERE IdRecompensa = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar recompensa'})
    }
}

export const patchRecompensa = async (req, res) => {
    try {
        const {id} = req.params
        const {IdFamilia, Nombre, Descripcion, PuntosNecesarios} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Recompensas SET IdFamilia = IFNULL(?, IdFamilia), Nombre = IFNULL(?, Nombre), Descripcion = IFNULL(?, Descripcion), PuntosNecesarios = IFNULL(?, PuntosNecesarios) WHERE IdRecompensa = ?',
            [IdFamilia, Nombre, Descripcion, PuntosNecesarios, id])

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Recompensa no encontrada"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Recompensas WHERE IdRecompensa = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar recompensa'})
    }
}

export const deleteRecompensa = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM Recompensas WHERE IdRecompensa = ?', [req.params.id])
        if (rows.affectedRows <= 0) return res.status(404).json({
            id: 0,
            message: 'No se pudo eliminar la recompensa'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Error de lado del servidor"
        })
    }
}