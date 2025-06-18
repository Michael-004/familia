import {conmysql} from '../db.js'

export const getLogros = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Logros Where IdUsuario = ?', [req.params.id])
        res.json(result)
    } catch (error) {
        return res.status(500).json({message: "Error al consultar logros"})
    }
}

export const getLogroxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Logros WHERE IdLogro = ?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            IdLogro: 0,
            message: "Logro no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: 'Error de lado del servidor'})        
    }
}

export const postLogro = async (req, res) => {
    try {
        const {IdUsuario, IdAsignacion, PuntosGanados} = req.body
        const [rows] = await conmysql.query(
            'INSERT INTO Logros (IdUsuario, IdAsignacion, PuntosGanados) VALUES (?, ?, ?)',
            [IdUsuario, IdAsignacion, PuntosGanados]
        )
        res.status(201).json({
            id: rows.insertId,
            PuntosGanados
        })
    } catch(error) {
        return res.status(500).json({message: 'Error al crear logro'})
    }
}

export const deleteLogro = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM Logros WHERE IdLogro = ?', [req.params.id])
        if (rows.affectedRows <= 0) return res.status(404).json({
            id: 0,
            message: 'No se pudo eliminar el logro'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Error de lado del servidor"
        })
    }
}