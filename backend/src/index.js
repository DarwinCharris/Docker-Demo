import express from 'express'
import { createPool } from 'mysql2/promise'
import cors from 'cors';
const app = express()
app.use(express.json());
app.use(cors());
const pool =createPool({
    host: 'mysqldb',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'dbDemo'

})
app.listen(3001)
app.get('/', (req, res)=>{
    res.send('Hello')
})
app.post('/enviar', (req, res) => {
    const { cedula, nombre, apellido, edad } = req.body; // Extraer los datos del cuerpo de la solicitud

    // Verificar si la cédula ya está en la tabla person
    pool.execute('SELECT * FROM person WHERE cedula = ?', [cedula])
        .then(([rows]) => {
            if (rows.length > 0) {
                // Si ya está en la base de datos
                return res.json({ mensaje: 'Ya está en la base de datos.' });
            } else {
                // Si no está, insertar en la tabla
                return pool.execute('INSERT INTO person (cedula, nombre, apellido, edad) VALUES (?, ?, ?, ?)', [cedula, nombre, apellido, edad])
                    .then(() => {
                        return res.json({ mensaje: 'Persona agregada.' });
                    });
            }
        })
        .catch(error => {
            console.error('Error en la base de datos:', error);
            res.status(500).json({ mensaje: 'Error en el servidor.' });
        });
});
// Endpoint para obtener todas las personas
app.get('/personas', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM person');
        res.json(rows); // Enviar los datos como respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

app.get('/ping', async (req, res)=>{
    const result = await pool.query('SELECT NOW()')
    res.json(result[0])
})
console.log('server on port', 3001)
