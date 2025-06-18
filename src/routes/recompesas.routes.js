import { Router } from "express";
import { getRecompensas, getRecompensaxId, postRecompensa, putRecompensa, patchRecompensa, deleteRecompensa } from '../controladores/recompensasCtrl.js'
const router=Router();

router.get('/recompensas', getRecompensas) //select
router.get('/recompensas/:id', getRecompensaxId) // select por id
router.post('/recompensas', postRecompensa) //insert
router.put('/recompensas/:id', putRecompensa) //update
router.patch('/recompensas/:id', patchRecompensa) // update
router.delete('/recompensas/:id', deleteRecompensa) //delete = eliminar

export default router