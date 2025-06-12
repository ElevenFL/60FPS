class EventBus {
    constructor() {
        this.handlers = new Map();
    }

    subscribe(eventName, handler) {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName).push(handler);
    }

    async publish(event) {
        const eventName = event.constructor.name;
        const handlers = this.handlers.get(eventName) || [];
        
        for (const handler of handlers) {
            try {
                await handler(event);
            } catch (error) {
                console.error(`Error handling event ${eventName}:`, error);
                // Aquí podrías implementar un sistema de reintentos o notificación
            }
        }
    }
}

// Singleton instance
const eventBus = new EventBus();
module.exports = eventBus; 