const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');

const app = express();
const USERS_FILE = path.join(__dirname, 'users.json'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(session({
  secret: 'clave_segura',
  resave: false,
  saveUninitialized: true
}));


app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

 
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).send('Usuario ya existe');


  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash, username });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.send('Usuario registrado correctamente');
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }

 
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).send('Usuario no encontrado');

  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send('Contraseña incorrecta');


  req.session.user = { email: user.email, username: user.username };
  res.redirect('/home');
});


app.get('/home', (req, res) => {
  if (!req.session.user) return res.redirect('/FormularioIn.html');

  const username = req.session.user.username;
  let html = fs.readFileSync(path.join(__dirname, 'public', 'Inicio.html'), 'utf-8');

 
  html = html.replace('{{username}}', username);
  res.send(html);
});


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/FormularioIn.html');
  });
});

app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});
