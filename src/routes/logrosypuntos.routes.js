import { Router } from "express";
import { getLogros, getLogroxId, postLogro, deleteLogro } from '../controladores/logrosCtrl.js'
import { getCanjeos, getCanjeoxId, postCanjeo, deleteCanjeo, patchCanjeo } from '../controladores/canjeosCtrl.js'

const router=Router();
//rutas de logros
router.get('/logrosUsuario/:id', getLogros)
router.get('/logros/:id', getLogroxId)
router.post('/logros', postLogro)
router.delete('/logros/:id', deleteLogro)

// rutas de canjeos
router.get('/canjeosUsuario/:id', getCanjeos)
router.get('/canjeos/:id', getCanjeoxId)
router.patch('/canjeos/:id', patchCanjeo)
router.post('/canjeos', postCanjeo)
router.delete('/canjeos/:id', deleteCanjeo)

export default router