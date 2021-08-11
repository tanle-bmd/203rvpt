// IMPORT LIBRARY
import { Service } from "@tsed/common";


// IMPORT CUSTOM
import { ContentDefine, ContentDefineType } from "../entity/ContentDefine";

@Service()
export class ContentDefineService {

    public async initContentDefine(type: ContentDefineType, title: string, body: string) {
        const content = new ContentDefine()
        content.title = title
        content.body = body
        content.type = type
        await content.save()
    }

} //END FILE