import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'
import asignacionesRoutes from './routes/asignaciones.routes.js'
import familiasRoutes from './routes/familias.routes.js'
import logrosypuntosRoutes from './routes/logrosypuntos.routes.js'
import recompesasRoutes from './routes/recompesas.routes.js'
import tareasRoutes from './routes/tareas.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'

//definir modulo de ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const corsOptions={
    origin:'*',//la direccion ip/dominio del servidor
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials:true
}

app.use(cors(corsOptions))
app.use(express.json()); //para que interprete los objetos json
app.use(express.urlencoded({extended:true}));  //se añade para poder receptar formularios
app.use('/uploads',express.static(path.join(__dirname,'../uploads')));

//rutas

app.use('/api/', asignacionesRoutes)
app.use('/api', familiasRoutes)
app.use('/api', logrosypuntosRoutes)
app.use('/api', recompesasRoutes)
app.use('/api', tareasRoutes)
app.use('/api', usuariosRoutes)



app.use((req,res,next)=>{
    res.status(404).json({
        message:'Endpoint not found'
    })
})

export default app;