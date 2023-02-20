const sequelize = require('./database');
const User = require('./models/User');

const createUser = async () => {
  // Créer un utilisateur
  const user = {
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password123'
  };
  
  try {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync();
    
    // Insérer l'utilisateur dans la base de données
    const newUser = await User.create(user);
    
    console.log(newUser.toJSON());
  } catch (error) {
    console.error(error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
  }
}

createUser();