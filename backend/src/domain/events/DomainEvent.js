class DomainEvent {
    constructor(aggregateId, occurredOn = new Date()) {
        this.aggregateId = aggregateId;
        this.occurredOn = occurredOn;
    }
}

module.exports = DomainEvent; 