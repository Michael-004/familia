import { Router } from "express";
import { getFamilias, getFamiliaxId, postFamilia, putFamilia, patchFamilia, deleteFamilia } from '../controladores/familiasCtrl.js'
const router=Router();

router.get('/familias', getFamilias)
router.get('/familias/:id', getFamiliaxId)
router.post('/familias', postFamilia)
router.put('/familias/:id', putFamilia)
router.patch('/familias/:id', patchFamilia)
router.delete('/familias/:id', deleteFamilia)

export default router