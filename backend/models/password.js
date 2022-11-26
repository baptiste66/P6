var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
// le modèle du mot de passe
passwordSchema
.is().min(8)                                   
.is().max(32)                                  
.has().uppercase(1)                           
.has().lowercase(1)                              
.has().symbols(1)
.has().digits(1)                              
.has().not().spaces()
module.exports=passwordSchema                           