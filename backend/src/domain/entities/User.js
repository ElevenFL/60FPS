const { UserValidationError } = require('../errors/UserErrors');
const { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } = require('../events/UserEvents');
const eventBus = require('../events/EventBus');

class User {
    constructor({
        id,
        username,
        email,
        password,
        createdAt = new Date()
    }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    validate() {
        if (!this.username || this.username.length < 3) {
            throw new UserValidationError('El nombre de usuario debe tener al menos 3 caracteres');
        }
        if (!this.email || !this.email.includes('@')) {
            throw new UserValidationError('El email debe ser válido');
        }
        if (!this.password || this.password.length < 6) {
            throw new UserValidationError('La contraseña debe tener al menos 6 caracteres');
        }
    }

    static create(userData) {
        const user = new User(userData);
        user.validate();
        eventBus.publish(new UserCreatedEvent(user.id, userData));
        return user;
    }

    update(userData) {
        const oldData = { ...this };
        Object.assign(this, userData);
        this.validate();
        eventBus.publish(new UserUpdatedEvent(this.id, oldData, userData));
        return this;
    }

    delete() {
        eventBus.publish(new UserDeletedEvent(this.id));
    }
}

module.exports = User; 