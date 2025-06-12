const DomainEvent = require('./DomainEvent');

class UserCreatedEvent extends DomainEvent {
    constructor(userId, userData) {
        super(userId);
        this.userData = userData;
    }
}

class UserUpdatedEvent extends DomainEvent {
    constructor(userId, oldData, newData) {
        super(userId);
        this.oldData = oldData;
        this.newData = newData;
    }
}

class UserDeletedEvent extends DomainEvent {
    constructor(userId) {
        super(userId);
    }
}

module.exports = {
    UserCreatedEvent,
    UserUpdatedEvent,
    UserDeletedEvent
}; 