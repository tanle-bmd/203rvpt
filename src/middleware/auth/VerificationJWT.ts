import { EndpointInfo, IMiddleware, Middleware, Req } from "@tsed/common";
import { Request } from 'express';

import Verification from "./Verification";
import JWT from "./strategy/JWT";

@Middleware()
export class VerificationJWT implements IMiddleware {
    public async use(
        @Req() request: Request,
        @EndpointInfo() endpoint: EndpointInfo
    ) {
        const verification = new Verification(new JWT())
        await verification.auth(request)
    }
}
