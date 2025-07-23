const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');

const app = express();
const USERS_FILE = path.join(__dirname, 'users.json'); // Asegúrate de que la ruta sea correcta

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de la sesión
app.use(session({
  secret: 'clave_segura',
  resave: false,
  saveUninitialized: true
}));

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Verifica si el archivo de usuarios existe y lee su contenido
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  // Verifica si el usuario ya existe
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).send('Usuario ya existe');

  // Hash de la contraseña
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash, username });

  // Escribe el nuevo usuario en el archivo
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.send('Usuario registrado correctamente');
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verifica si el archivo de usuarios existe y lee su contenido
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

  // Busca el usuario por correo electrónico
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).send('Usuario no encontrado');

  // Verifica la contraseña
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send('Contraseña incorrecta');

  // Guarda la sesión del usuario
  req.session.user = { email: user.email, username: user.username };
  res.redirect('/home');
});

// Ruta para la página de inicio
app.get('/home', (req, res) => {
  if (!req.session.user) return res.redirect('/FormularioIn.html');

  const username = req.session.user.username;
  let html = fs.readFileSync(path.join(__dirname, 'public', 'Inicio.html'), 'utf-8');

  // Reemplaza el marcador de posición con el nombre de usuario
  html = html.replace('{{username}}', username);
  res.send(html);
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/FormularioIn.html');
  });
});

// Inicia el servidor
app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});
