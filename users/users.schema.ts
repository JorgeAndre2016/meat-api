import * as mongoose from 'mongoose';
import { validateCPF } from './../common/validators';
import * as bcrypt from 'bcrypt';
import { environment } from '../common/environment';

// definição de inteface do usuário que extends
// do Document do mongoose que já contém diversas coisas
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

// assinatura findByEmail
export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string): Promise<User>
}

/**
 * Definição de metadados dos documento Users
 * (Informar ao mongoose quais o metadados do documento)
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: false, // indica para o mongo que este campo deve ser informado por padrão
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});

userSchema.statics.findByEmail = function(email: string) {
    return this.findOne({email}); // {email: email}
}

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
        obj.password = hash;
        next();
    })
    .catch(next);
}

const saveMiddleware = function (next) {
    const user: User = this;
    if(!user.isModified('password')){
        next();
    } else {
      hashPassword(user, next);
    }
}

const updateMiddleware = function(next){
    if(!this.getUpdate().password){
        next();
    } else {
        hashPassword(this.getUpdate(), next);
    }
}

// evento save sendo registrado
userSchema.pre('save', saveMiddleware);
// evento findOneAndUpdate sendo registrado
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

// name do model = inferir nome da collection no plural
// <User> definição de um tipo generico para o model no caso a interface User
export const User = mongoose.model<User, UserModel>('User', userSchema);