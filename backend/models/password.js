var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
// le modèle du mot de passe
passwordSchema
//8 a 32 lettre
.is().min(8)                                   
.is().max(32)        
//maj min                          
.has().uppercase(1)                           
.has().lowercase(1)    
// symbole spécial                          
.has().symbols(1)
// nombre
.has().digits(1)                              
.has().not().spaces()
module.exports=passwordSchema                           