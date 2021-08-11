import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class Password {
    static hash(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS)
    }

    static validate(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}
