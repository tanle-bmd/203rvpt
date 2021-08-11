// IMPORT LIBRARY
import { Controller, Post as PostMethod, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi, { custom } from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { Post, PostType, RoomType } from '../../entity/Post';
import { MultipartFile } from '@tsed/multipartfiles';
import Jimp from 'jimp';
import CONFIG from '../../../config';
import { PostService, SortBy } from '../../services/PostService';
import { PostStorage } from '../../entity/PostStorage';
import { PostFavorite } from '../../entity/PostFavorite';
import JWT from '../../middleware/auth/strategy/JWT';


@Controller("/customer/post")
@Docs("docs_customer")
export class PostController {
    constructor(
        private postService: PostService,
    ) { }


    // =====================GET LIST=====================
    @Get('')
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @QueryParams('postType') postType: PostType,
        @QueryParams('roomType') roomType: RoomType,
        @QueryParams('sortBy') sortBy: SortBy,
        @QueryParams('cityId') cityId: number,
        @QueryParams('priceFrom') priceFrom: number,
        @QueryParams('priceTo') priceTo: number,
        @QueryParams('areaFrom') areaFrom: number,
        @QueryParams('areaTo') areaTo: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let { posts, total } = await this.postService.getManyAndCount({
            page, limit, postType, roomType,
            isBlock: false, cityId, sortBy,
            priceFrom, priceTo, areaFrom, areaTo
        })

        if (token) {
            const jwt = new JWT()
            await jwt.authenticateCustomer(req)
        }

        if (!posts.length) return res.sendOK({ posts, total })

        posts = await this.postService.mapFavorite(posts, req.customer?.id)

        return res.sendOK({ posts, total });
    }


    // =====================GET LIST=====================
    @Get('/own')
    @UseAuth(VerificationJWT)
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findOwn(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @QueryParams('isShow') isShow: boolean = true,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `post.isDeleted = false 
        AND customer.id = ${req.customer.id}
        AND post.isShow = ${isShow}`

        let [posts, total] = await Post.createQueryBuilder('post')
            .leftJoinAndSelect('post.customer', 'customer')
            .leftJoinAndSelect('post.addressCity', 'addressCity')
            .leftJoinAndSelect('post.addressDistrict', 'addressDistrict')
            .leftJoinAndSelect('post.addressWard', 'addressWard')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('post.id', 'DESC')
            .getManyAndCount()

        if (!posts.length) return res.sendOK({ posts, total })

        posts = await this.postService.mapFavorite(posts, req.customer.id)

        return res.sendOK({ posts, total });
    }


    // =====================GET LIST=====================
    @Get('/storage')
    @UseAuth(VerificationJWT)
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findStorage(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `post.isDeleted = false 
        AND customer.id = ${req.customer.id}
        AND post.isShow = true
        AND post.isBlock = false`

        let [posts, total] = await Post.createQueryBuilder('post')
            .leftJoinAndSelect('post.addressCity', 'addressCity')
            .leftJoinAndSelect('post.addressDistrict', 'addressDistrict')
            .leftJoinAndSelect('post.addressWard', 'addressWard')
            .leftJoinAndSelect('post.postStorages', 'postStorages')
            .leftJoinAndSelect('postFavorites.customer', 'customer')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('postFavorites.id', 'DESC')
            .getManyAndCount()

        if (!posts.length) return res.sendOK({ posts, total })

        posts = await this.postService.mapFavorite(posts, req.customer.id)

        return res.sendOK({ posts, total });
    }


    // =====================GET LIST=====================
    @Get('/favorite')
    @UseAuth(VerificationJWT)
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findFavorite(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `post.isDeleted = false 
        AND customer.id = ${req.customer.id}
        AND post.isShow = true
        AND post.isBlock = false`

        let [posts, total] = await Post.createQueryBuilder('post')
            .leftJoinAndSelect('post.addressCity', 'addressCity')
            .leftJoinAndSelect('post.addressDistrict', 'addressDistrict')
            .leftJoinAndSelect('post.addressWard', 'addressWard')
            .leftJoinAndSelect('post.postFavorites', 'postFavorites')
            .leftJoinAndSelect('postFavorites.customer', 'customer')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('postFavorites.id', 'DESC')
            .getManyAndCount()

        if (!posts.length) return res.sendOK({ posts, total })

        posts = await this.postService.mapFavorite(posts, req.customer.id)

        return res.sendOK({ posts, total });
    }


    @Get('/:postId')
    @Validator({
    })
    async findOne(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await this.postService.getDetail(postId)

        if (token) {
            const jwt = new JWT()
            await jwt.authenticateCustomer(req)
        }


        const isFavorite = await this.postService.isFavorite(postId, req.customer?.id)
        post.isFavorite = isFavorite
        res.sendOK(post)

        post.view += 1
        post.save()
        return
    }


    // =====================CREATE ITEM=====================
    @PostMethod('')
    @UseAuth(VerificationJWT)
    @Validator({
        post: Joi.required(),
    })
    async create(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("post") post: Post,
        @BodyParams('addressCityId') addressCityId: number,
        @BodyParams('addressDistrictId') addressDistrictId: number,
        @BodyParams('addressWardId') addressWardId: number,
        @BodyParams('utilIds', Number) utilIds: number[],
        @BodyParams('images', String) images: string[],
    ) {
        // Luu dia chi
        if (addressCityId) await post.assignAddressCity(addressCityId)
        if (addressDistrictId) await post.assignAddressDistrict(addressDistrictId)
        if (addressWardId) await post.assignAddressWard(addressWardId)

        // Luu tien ich
        if (!utilIds || !utilIds.length) {
            return res.sendClientError('Vui lòng chọn ít nhất 1 tiện ích!')
        }
        await post.assignUtils(utilIds)

        // Luu hinh anh
        if (!images || !images.length) {
            return res.sendClientError('Vui lòng cung cấp ít nhất 1 hình ảnh!')
        }
        await post.assignGalleries(images)

        // Luu tin dang
        post.customer = req.customer
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
        const oldPost = await Post.findOneOrThrowId(postId, {
            relations: ['customer']
        })

        if (req.customer.id != oldPost.customer.id) {
            return res.sendClientError('Không thể cập nhật tin đăng của người khác!')
        }

        await this.postService.update({
            postId, post, addressCityId, addressDistrictId,
            addressWardId, utilIds, images
        })

        return res.sendOK(post)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/isShow/on')
    @UseAuth(VerificationJWT)
    @Validator({
        postId: Joi.number().required()
    })
    async turnOnIsShow(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, {
            relations: ['customer']
        })

        if (req.customer.id != post.customer.id) {
            return res.sendClientError('Không thể cập nhật tin đăng của người khác!')
        }

        post.isShow = true
        await post.save()

        return res.sendOK(post)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/isShow/off')
    @UseAuth(VerificationJWT)
    @Validator({
        postId: Joi.number().required()
    })
    async turnOffIsShow(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, {
            relations: ['customer']
        })

        if (req.customer.id != post.customer.id) {
            return res.sendClientError('Không thể cập nhật tin đăng của người khác!')
        }

        post.isShow = false
        await post.save()

        return res.sendOK(post)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/save')
    @UseAuth(VerificationJWT)
    @Validator({
        postId: Joi.number().required()
    })
    async save(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, null, '')

        let where = `post.id = ${postId} 
        AND customer.id = ${req.customer.id}`

        const isExist = await PostStorage.createQueryBuilder('postStorage')
            .leftJoinAndSelect('postStorage.post', 'post')
            .leftJoinAndSelect('postStorage.customer', 'customer')
            .where(where)
            .getOne()

        if (!isExist) {
            const storage = new PostStorage()
            storage.post = post
            storage.customer = req.customer
            await storage.save()
        }

        return res.sendOK(null)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/like')
    @UseAuth(VerificationJWT)
    @Validator({
        postId: Joi.number().required()
    })
    async like(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, null, '')

        let where = `post.id = ${postId} 
        AND customer.id = ${req.customer.id}`

        const isExist = await PostFavorite.createQueryBuilder('postFavorite')
            .leftJoinAndSelect('postFavorite.post', 'post')
            .leftJoinAndSelect('postFavorite.customer', 'customer')
            .where(where)
            .getOne()

        if (!isExist) {
            const favorite = new PostFavorite()
            favorite.post = post
            favorite.customer = req.customer
            await favorite.save()
        }


        return res.sendOK(null)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/unsave')
    @UseAuth(VerificationJWT)
    @Validator({
        postId: Joi.number().required()
    })
    async unsave(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, null, '')

        let where = `post.id = ${postId} 
        AND customer.id = ${req.customer.id}`

        const isExist = await PostStorage.createQueryBuilder('postStorage')
            .leftJoinAndSelect('postStorage.post', 'post')
            .leftJoinAndSelect('postStorage.customer', 'customer')
            .where(where)
            .getOne()

        if (isExist) await isExist.remove()

        return res.sendOK(null)
    }


    // =====================UPDATE ITEM=====================
    @PostMethod('/:postId/unlike')
    @UseAuth(VerificationJWT)
    @Validator({
        postId: Joi.number().required()
    })
    async unlike(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("postId") postId: number,
    ) {
        const post = await Post.findOneOrThrowId(postId, null, '')

        let where = `post.id = ${postId} 
        AND customer.id = ${req.customer.id}`

        const isExist = await PostFavorite.createQueryBuilder('postFavorite')
            .leftJoinAndSelect('postFavorite.post', 'post')
            .leftJoinAndSelect('postFavorite.customer', 'customer')
            .where(where)
            .getOne()

        if (isExist) await isExist.remove()

        return res.sendOK(null)
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
