const User = require('../../domain/entities/User');
const { UserValidationError } = require('../../domain/errors/UserErrors');
const eventBus = require('../../domain/events/EventBus');

describe('User Entity', () => {
    let userData;

    beforeEach(() => {
        userData = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };
    });

    test('should create a valid user', () => {
        const user = User.create(userData);
        expect(user).toBeInstanceOf(User);
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
    });

    test('should throw validation error for invalid username', () => {
        userData.username = 'ab';
        expect(() => User.create(userData)).toThrow(UserValidationError);
    });

    test('should throw validation error for invalid email', () => {
        userData.email = 'invalid-email';
        expect(() => User.create(userData)).toThrow(UserValidationError);
    });

    test('should throw validation error for short password', () => {
        userData.password = '12345';
        expect(() => User.create(userData)).toThrow(UserValidationError);
    });

    test('should update user data', () => {
        const user = User.create(userData);
        const newData = { username: 'newusername' };
        user.update(newData);
        expect(user.username).toBe(newData.username);
    });

    test('should publish events on user operations', () => {
        const eventSpy = jest.spyOn(eventBus, 'publish');
        
        const user = User.create(userData);
        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
            aggregateId: user.id
        }));

        user.update({ username: 'newusername' });
        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
            aggregateId: user.id
        }));

        user.delete();
        expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({
            aggregateId: user.id
        }));
    });
}); 