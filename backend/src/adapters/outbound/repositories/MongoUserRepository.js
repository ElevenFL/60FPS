const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserRepository = require('../../../domain/ports/repositories/UserRepository');
const User = require('../../../domain/entities/User');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Método para encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = mongoose.model('User', userSchema);

class MongoUserRepository extends UserRepository {
    async findById(id) {
        const userDoc = await UserModel.findById(id);
        return userDoc ? this._toDomain(userDoc) : null;
    }

    async findByEmail(email) {
        const userDoc = await UserModel.findOne({ email });
        return userDoc ? this._toDomain(userDoc) : null;
    }

    async findByUsername(username) {
        const userDoc = await UserModel.findOne({ username });
        return userDoc ? this._toDomain(userDoc) : null;
    }

    async create(user) {
        const userDoc = new UserModel({
            username: user.username,
            email: user.email,
            password: user.password
        });
        const savedUser = await userDoc.save();
        return this._toDomain(savedUser);
    }

    async update(id, user) {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                username: user.username,
                email: user.email,
                password: user.password
            },
            { new: true }
        );
        return updatedUser ? this._toDomain(updatedUser) : null;
    }

    async delete(id) {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        return deletedUser ? this._toDomain(deletedUser) : null;
    }

    async comparePassword(userId, password) {
        const userDoc = await UserModel.findById(userId);
        if (!userDoc) return false;
        return bcrypt.compare(password, userDoc.password);
    }

    _toDomain(userDoc) {
        return new User({
            id: userDoc._id.toString(),
            username: userDoc.username,
            email: userDoc.email,
            password: userDoc.password,
            createdAt: userDoc.createdAt
        });
    }
}

module.exports = MongoUserRepository; 