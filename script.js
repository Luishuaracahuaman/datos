const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'serverr.c5lqso4o46xm.us-east-1.rds.amazonaws.com',  // Verifica esta dirección
    user: 'luis',
    password: 'enrique12345..',
    database: 'hotel_db',
    port: 3306  // Agregamos el puerto explícitamente
});

// Agregamos manejo de error en la conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos MySQL');
});

app.post('/guardar', (req, res) => {
    const { nombre, apellidos } = req.body;
    db.query('INSERT INTO clientes (nombre, apellidos) VALUES (?, ?)', 
        [nombre, apellidos], 
        (error) => {
            if (error) {
                console.error('Error al insertar:', error);
                res.status(500).send('Error');
            } else {
                res.send('OK');
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});

// Manejo de errores de conexión
db.on('error', (err) => {
    console.error('Error de base de datos:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Se perdió la conexión con la base de datos.');
    } else {
        throw err;
    }
});