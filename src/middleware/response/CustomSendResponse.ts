import { OverrideProvider, Res, ResponseData, SendResponseMiddleware, ConverterService, Req } from "@tsed/common";
import { isStream } from "@tsed/core";

@OverrideProvider(SendResponseMiddleware)
export class CustomDefaultResponse {

    constructor(private converterService: ConverterService) { }

    public use(@Req() request: Req, @Res() response: Res): any {
        const { ctx: { data, endpoint } } = request;

        let message = ""
        if (data && data.message) {
            message = data.message
            delete data.message
        }

        if (data === undefined) {
            return response.send();
        }

        if (isStream(data)) {
            data.pipe(response);
            return response;
        }

        const payload = {
            data,
            message,
            status: true
        };

        return response.json(payload);
    }
}
