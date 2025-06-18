import {conmysql} from '../db.js'

export const getFamilias = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Familias')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message: "Error al consultar familias"})
    }
}

export const getFamiliaxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM Familias WHERE IdFamilia = ?', [req.params.id])
        if (result.length <= 0) return res.status(404).json({
            IdFamilia: 0,
            message: "Familia no encontrada"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: 'Error de lado del servidor'})        
    }
}

export const postFamilia = async (req, res) => {
    try {
        const {NombreFamilia} = req.body
        const [rows] = await conmysql.query(
            'INSERT INTO Familias (NombreFamilia) VALUES (?)',
            [NombreFamilia]
        )
        res.send({
            id: rows.insertId,
            NombreFamilia
        })
    } catch(error) {
        return res.status(500).json({message: 'Error al crear familia'})
    }
}

export const putFamilia = async (req, res) => {
    try {
        const {id} = req.params
        const {NombreFamilia} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Familias SET NombreFamilia = ? WHERE IdFamilia = ?',
            [NombreFamilia, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Familia no encontrada"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Familias WHERE IdFamilia = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar familia'})
    }
}

export const patchFamilia = async (req, res) => {
    try {
        const {id} = req.params
        const {NombreFamilia} = req.body
        
        const [result] = await conmysql.query(
            'UPDATE Familias SET NombreFamilia = IFNULL(?, NombreFamilia) WHERE IdFamilia = ?',
            [NombreFamilia, id]
        )

        if(result.affectedRows <= 0) return res.status(404).json({
            message: "Familia no encontrada"
        })  
        
        const [rows] = await conmysql.query('SELECT * FROM Familias WHERE IdFamilia = ?', [id])
        res.json(rows[0])
    } catch(error) {
        return res.status(500).json({message: 'Error al actualizar familia'})
    }
}

export const deleteFamilia = async (req, res) => {
    try {
        const [rows] = await conmysql.query('DELETE FROM Familias WHERE IdFamilia = ?', [req.params.id])
        if (rows.affectedRows <= 0) return res.status(404).json({
            id: 0,
            message: 'No se pudo eliminar la familia'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Error de lado del servidor"
        })
    }
}