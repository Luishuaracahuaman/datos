const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    host: 'serverr.c5iqso4o4sxm.us-east-1.rds.amazonaws.com', // Host correcto
    user: 'luis',
    password: 'luis12345..',
    database: 'hotel_db',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
};

const db = mysql.createConnection(dbConfig);

db.connect(error => {
    if (error) {
        console.error('Error de conexión:', error);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.post('/guardar', (req, res) => {
    try {
        const { nombre, apellidos } = req.body;
        
        if (!nombre || !apellidos) {
            return res.status(400).json({ error: 'Nombre y apellidos son requeridos' });
        }

        const query = 'INSERT INTO clientes (nombre, apellidos) VALUES (?, ?)';
        
        db.query(query, [nombre, apellidos], (error, results) => {
            if (error) {
                console.error('Error en la inserción:', error);
                return res.status(500).json({ error: 'Error al guardar los datos' });
            }
            res.json({ mensaje: 'Datos guardados correctamente' });
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

db.on('error', (err) => {
    console.error('Error de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Se perdió la conexión con la base de datos.');
    }
});