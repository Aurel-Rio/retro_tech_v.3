const express = require('express');
const Sequelize = require('sequelize');

// Création de l'application Express
const app = express();



const path = require('path');
// ...

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});














// Connexion à la base de données MySQL
const sequelize = new Sequelize('database_username', 'useruserusername', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Définition du modèle pour la table "users"
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userusername: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

// Création d'un utilisateur dans la table "users"
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.create({ username, email, password });
  res.json(user);
});

// Récupération de tous les utilisateurs dans la table "users"
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Récupération d'un utilisateur par ID dans la table "users"
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Modification d'un utilisateur par ID dans la table "users"
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const user = await User.findByPk(id);
  if (user) {
    user.username = username;
    user.email = email;
    user.password = password;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Suppression d'un utilisateur par ID dans la table "users"
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

app.use(express.static(path.join(__dirname, 'public')));