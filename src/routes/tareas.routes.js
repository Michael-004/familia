import { Router } from "express";
import { getTareas, getTareaxId, postTarea, putTarea, patchTarea, deleteTarea } from '../controladores/tareasCtrl.js'
const router=Router()

router.get('/tareasFa/:id', getTareas)
router.get('/tareas/:id', getTareaxId)
router.post('/tareas', postTarea)
router.put('/tareas/:id', putTarea)
router.patch('/tareas/:id', patchTarea)
router.delete('/tareas/:id', deleteTarea)


export default router