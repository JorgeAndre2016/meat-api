// const users = [
//     { id: '1', name: 'Peter Parker', email: 'peter@marvel.com' },
//     { id: '2', name: 'Bruce Wayne', email: 'bruce@dc.com' }
// ];

// export class User {
//     static findAll(): Promise<any[]> {
//         return Promise.resolve(users);
//     };

//     static findById(id: string): Promise<any[]> {
//         return new Promise(resolve=>{
//             const filtered = users.filter(user => user.id === id);

//             let user = undefined;
            
//             if(filtered.length > 0) {
//                 user = filtered[0];
//             };
//             resolve(user);
//         })
//     };
// }

// utilizando o mongoose
import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';
import * as bcrypt from 'bcrypt';
import { environment } from '../common/environment';

export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

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
        select: false, // evitando da query trazer este campo no select
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
})

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
}

const saveMiddleware = function(next){
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
        hashPassword(this.getUpdate, next);
    }
}
// pre - evento save - assinatura middleware pre
userSchema.pre('save', saveMiddleware);

// pre - evento findOneAndUpdate - assinatura middleware pre
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

export const User = mongoose.model<User>('User', userSchema);