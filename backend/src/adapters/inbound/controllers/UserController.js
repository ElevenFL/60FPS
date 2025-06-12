const jwt = require('jsonwebtoken');

class UserController {
    constructor(userUseCases) {
        this.userUseCases = userUseCases;
    }

    async register(req, res) {
        try {
            const user = await this.userUseCases.register(req.body);
            const token = this._generateToken(user);
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userUseCases.login(email, password);
            const token = this._generateToken(user);
            res.json({ user, token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async getUser(req, res) {
        try {
            const user = await this.userUseCases.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await this.userUseCases.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            await this.userUseCases.deleteUser(req.params.id);
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    _generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                username: user.username 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
    }
}

module.exports = UserController; 