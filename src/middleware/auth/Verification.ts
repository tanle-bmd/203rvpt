import AuthStrategy from './strategy/AuthStrategy';
import { Request } from 'express';

class Verification {
    private authStrategy: AuthStrategy

    constructor(authStrategy: AuthStrategy) {
        this.authStrategy = authStrategy
    }

    auth = async (req: Request): Promise<any> => {
        await this.authStrategy.auth(req)
    }
}

export default Verification
