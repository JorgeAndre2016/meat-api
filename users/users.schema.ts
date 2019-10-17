import * as mongoose from 'mongoose';
import { validateCPF } from './../common/validators';

// definição de inteface do usuário que extends
// do Document do mongoose que já contém diversas coisas
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
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

// name do model = inferir nome da collection no plural
// <User> definição de um tipo generico para o model no caso a interface User
export const User = mongoose.model<User>('User', userSchema);