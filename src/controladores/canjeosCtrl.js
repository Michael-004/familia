import {conmysql} from '../db.js'

export const getCanjeos = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            'SELECT c.IdCanjeo, u.Nombre As Usuario, r.Descripcion As Recompensa, r.PuntosNecesarios, c.FechaCanje, c.Estado FROM Canjeos c Join Usuarios u on c.IdUsuario = u.IdUsuario Join Recompensas r on c.IdRecompensa = r.IdRecompensa Where c.IdUsuario = ?'
            , [req.params.id])
        res.json(result)
    } catch (error) {
        return res.status(500).json({message: "Error al consultar canjeos"})
    }
}

export const getCanjeoxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Canjeos WHERE IdCanjeo = ?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            IdCanjeo: 0,
            message: "Canjeo no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: 'Error de lado del servidor'})        
    }
}

export const postCanjeo = async (req, res) => {
    try {
        const {IdUsuario, IdRecompensa} = req.body
        const [rows] = await conmysql.query(
            'INSERT INTO Canjeos (IdUsuario, IdRecompensa) VALUES (?, ?)',
            [IdUsuario, IdRecompensa]
        )
        res.status(201).json({
            id: rows.insertId
        })
    } catch(error) {
        return res.status(500).json({message: 'Error al crear canjeo'})
    }
}

export const patchCanjeo = async (req, res) => {
    try {
        const {id} = req.params
        const {IdRecompensa, Estado} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Canjeos SET IdRecompensa = IFNULL(?, IdRecompensa), Estado = IFNULL(?, Estado) WHERE IdCanjeo = ?',
            [IdRecompensa, Estado, id])

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Canjeo no encontrado"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Canjeos WHERE IdCanjeo = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar Canjeo'})
    }
}

export const deleteCanjeo = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM Canjeos WHERE IdCanjeo = ?', [req.params.id])
        if (rows.affectedRows <= 0) return res.status(404).json({
            id: 0,
            message: 'No se pudo eliminar el canjeo'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Error de lado del servidor"
        })
    }
}