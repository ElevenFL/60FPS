const User = require('../../domain/entities/User');

class UserUseCases {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(userData) {
        const user = new User(userData);
        user.validate();

        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        const existingUsername = await this.userRepository.findByUsername(user.username);
        if (existingUsername) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        return await this.userRepository.create(user);
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isValidPassword = await this.userRepository.comparePassword(user.id, password);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }

        return user;
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }

    async updateUser(id, userData) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const updatedUser = new User({ ...user, ...userData });
        updatedUser.validate();

        return await this.userRepository.update(id, updatedUser);
    }

    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return await this.userRepository.delete(id);
    }
}

module.exports = UserUseCases; 