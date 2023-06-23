const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const dbUrl = process.env.dbURL;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type:Boolean,
        default: false
    }
})

const Users = mongoose.model('user', userSchema);
exports.Users = Users

exports.createNewUser = async  (name,email,password) => {
        try{
            await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            let hashed = await bcrypt.hash(password,10)
            try{
                let user = new Users({
                    name: name,
                    email: email,
                    password: hashed
                })
                await user.save();
                
            }catch(e){
                mongoose.disconnect();
                throw e;
            }

            mongoose.disconnect();
             
        }
        catch(e){
            throw e;
        }
    
}

exports.login = async (email,password) => {
    try{
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        let user = await Users.findOne({email: email});
        if(!user){
            mongoose.disconnect();
            throw new Error('Email does not exist')
        }
        let compare = await bcrypt.compare(password,user.password);
        if(!compare){
            mongoose.disconnect();
            throw new Error('Password is incorrect')
        }
        mongoose.disconnect();
        return {
            id: user._id,
            admin: user.isAdmin
        };
    }catch(e){
        throw e;
    }
}

