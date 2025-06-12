const DomainError = require('./DomainError');

class UserNotFoundError extends DomainError {
    constructor(userId) {
        super(`Usuario con ID ${userId} no encontrado`);
    }
}

class UserValidationError extends DomainError {
    constructor(message) {
        super(`Error de validación de usuario: ${message}`);
    }
}

class UserAlreadyExistsError extends DomainError {
    constructor(field, value) {
        super(`Ya existe un usuario con ${field}: ${value}`);
    }
}

module.exports = {
    UserNotFoundError,
    UserValidationError,
    UserAlreadyExistsError
}; 