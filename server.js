const express = require('express');
const Sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');
const path = require('path');

// Création de l'application Express
const app = express();

// Utilisation de middleware pour parser les requêtes JSON
app.use(express.json());

// Envoi du fichier index.html pour la route '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connexion à la base de données MySQL
const sequelize = new Sequelize('retrotech', 'riozacki', 'Domino777.', {
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
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  tableName: 'Users'
});

// Création d'un utilisateur dans la table "users"
app.post('/models/users', [
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Récupération de tous les utilisateurs dans la table "users"
app.get('/models/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Récupération d'un utilisateur par ID dans la table "users"
app.get('/models/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Modification d'un utilisateur par ID dans la table "users"
app.put('/models/users/:id', [
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const user = await User.findByPk(id);
  if (user) {
    try {
      await user.update({ username, email, password });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating user' });
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Suppression d'un utilisateur par ID dans la table "users"
app.delete('/models/users/:id', async (req, res) => {
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