const mongoose = require('mongoose');

const user=process.env.mongoose_user
const password= process.env.mongoose_password
//connexion mongoose
mongoose.connect(`mongodb+srv://${user}:${password}@cluster2.thsotrz.mongodb.net/test`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  module.exports= mongoose