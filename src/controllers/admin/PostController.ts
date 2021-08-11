// IMPORT LIBRARY
import { Controller, Post as PostMethod, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { Post, PostType, RoomType } from '../../entity/Post';
import { PostService, SortBy } from '../../services/PostService';
import { MultipartFile } from '@tsed/multipartfiles';
import Jimp from 'jimp';
import CONFIG from '../../../config';


@Controller("/admin/post")
@Docs("docs_admin")
export class PostController {
    constructor(
        private postService: PostService,
    ) { }


    // =====================GET LIST=====================
    @Get('')
    @UseAuth(VerificationJWT)
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @QueryParams("search") search: string = "",
        @QueryParams('postType') postType: PostType,
        @QueryParams('roomType') roomType: RoomType,
        @QueryParams('sortBy') sortBy: SortBy,
        @QueryParams('cityId') cityId: number,
        @QueryParams('priceFrom') priceFrom: number,
        @QueryParams('priceTo') priceTo: number,
        @QueryParams('areaFrom') areaFrom: number,
        @QueryParams('areaTo') areaTo: number,
        @QueryParams("from") from: Date,
        @QueryParams("to") to: Date,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { posts, total } = await this.postService.getManyAndCount({
            page, limit, postType, roomType,
            isBlock: undefined, cityId, sortBy, search,
            priceFrom, priceTo, areaFrom, areaTo, from, to
        })

        return res.sendOK({ posts, total });
    }


    @Get('/:postId')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async findOne(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await this.postService.getDetail(postId)

        return res.sendOK(post)
    }


    // =====================CREATE ITEM=====================
    @PostMethod('/:postId/block')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async block(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, null, '')
        post.isBlock = true
        await post.save()

        return res.sendOK(post)
    }


    // =====================CREATE ITEM=====================
    @PostMethod('/:postId/unblock')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async unblock(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, null, '')
        post.isBlock = false
        await post.save()

        return res.sendOK(post)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        post: Joi.required(),
        postId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("post") post: Post,
        @PathParams("postId") postId: number,
        @BodyParams('addressCityId') addressCityId: number,
        @BodyParams('addressDistrictId') addressDistrictId: number,
        @BodyParams('addressWardId') addressWardId: number,
        @BodyParams('utilIds', Number) utilIds: number[],
        @BodyParams('images', String) images: string[],
    ) {
        await Post.findOneOrThrowId(postId)

        await this.postService.update({
            postId, post, addressCityId, addressDistrictId,
            addressWardId, utilIds, images
        })

        return res.sendOK(post)
    }


    // =====================UPLOAD IMAGE=====================
    @PostMethod('/upload')
    @UseAuth(VerificationJWT)
    async uploadFile(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @MultipartFile('file') file: Express.Multer.File,
    ) {
        const image = await Jimp.read(file.path)
        image.resize(700, Jimp.AUTO);
        image.quality(80)
        image.writeAsync(file.path)

        file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');

        return res.sendOK(file)
    }


} // END FILE
