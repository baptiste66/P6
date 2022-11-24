const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
//max min caractère
.is().min(10)                                    
.is().max(64)
//majuscule miniscule                                  
.has().uppercase()                              
.has().lowercase()
//chiffre et pas d'espace                           
.has().digits()                                
.has().not().spaces()                    

module.exports = passwordSchema;