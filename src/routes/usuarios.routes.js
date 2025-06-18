import { Router } from "express";
import { getUsuarios, getUsuarioxId, postUsuario, patchUsuario, deleteUsuario, putUsuario, login } from '../controladores/usuariosCtrl.js'
import { verifyToken } from "../jwt/verifyToken.js";
const router=Router()

router.get('/usuarios', getUsuarios)
router.get('/usuarios/:id', getUsuarioxId)
router.post('/usuarios', postUsuario)
router.put('/usuarios/:id', putUsuario)
router.patch('/usuarios/:id', patchUsuario)
router.delete('/usuarios/:id', deleteUsuario)
router.post('/login', login)

export default router