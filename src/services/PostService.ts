// IMPORT LIBRARY
import { Service } from "@tsed/common";


// IMPORT CUSTOM
import { Post, PostType, RoomType } from "../entity/Post";
import { PostFavorite } from "../entity/PostFavorite";
import { getFromToDate } from "../util/helper";

interface GetPostParams {
    page: number
    limit: number
    search?: string
    postType?: PostType
    roomType?: RoomType
    sortBy?: SortBy
    cityId?: number
    isBlock?: boolean
    priceFrom?: number
    priceTo?: number
    areaFrom?: number
    areaTo?: number
    from?: Date,
    to?: Date
}

export enum SortBy {
    CreatedAtDESC = 'CREATED_AT_DESC',
    CreatedAtASC = 'CREATED_AT_ASC',
    PriceDESC = 'PRICE_DESC',
    PriceASC = 'PRICE_ASC'
}

interface UpdatePostParams {
    post: Post,
    postId: number,
    addressCityId: number,
    addressDistrictId: number,
    addressWardId: number,
    utilIds: number[],
    images: string[],
}

@Service()
export class PostService {

    public async getManyAndCount({
        page, limit, postType, roomType, isBlock, priceFrom, priceTo,
        sortBy = SortBy.CreatedAtDESC, cityId, search, areaFrom, areaTo,
        from, to
    }: GetPostParams) {
        let where = `post.isDeleted = false`

        if (postType) {
            where += ` AND post.postType = '${postType}'`
        }

        if (roomType) {
            where += ` AND post.roomType = '${roomType}'`
        }

        if (cityId) {
            where += ` AND addressCity.id = ${cityId}`
        }

        if (isBlock != undefined) {
            where += ` AND post.isBlock = ${isBlock}`
        }

        if (search) {
            where += ` AND post.title LIKE '%${search}%' `
        }

        if (priceFrom) {
            where += ` AND post.price >= ${priceFrom}`
        }

        if (priceTo) {
            where += ` AND post.price <= ${priceTo}`
        }

        if (areaFrom) {
            where += ` AND post.area >= ${areaFrom}`
        }

        if (areaTo) {
            where += ` AND post.area <= ${areaTo}`
        }

        if (from && to) {
            const { start, end } = getFromToDate(from, to)
            where += ` AND post.createdAt BETWEEN ${start} AND ${end} `
        }

        const builder = Post.createQueryBuilder('post')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)

        switch (sortBy) {
            case SortBy.CreatedAtASC:
                builder.orderBy('post.createdAt', 'ASC')
                break;

            case SortBy.PriceDESC:
                builder.orderBy('post.price', 'DESC')
                break;

            case SortBy.PriceASC:
                builder.orderBy('post.price', 'ASC')
                break;

            default:
                builder.orderBy('post.createdAt', 'DESC')
                break;
        }

        const [posts, total] = await builder
            .leftJoinAndSelect('post.addressCity', 'addressCity')
            .leftJoinAndSelect('post.addressWard', 'addressWard')
            .leftJoinAndSelect('post.addressDistrict', 'addressDistrict')
            .leftJoinAndSelect('post.customer', 'customer')
            .getManyAndCount()

        return { posts, total }
    }


    public async getDetail(postId: number) {
        let where = `post.isDeleted = false 
        AND post.id = ${postId}`

        const post = await Post.createQueryBuilder('post')
            .leftJoinAndSelect('post.customer', 'customer')
            .leftJoinAndSelect('post.addressCity', 'addressCity')
            .leftJoinAndSelect('post.addressDistrict', 'addressDistrict')
            .leftJoinAndSelect('post.addressWard', 'addressWard')
            .leftJoinAndSelect('post.utils', 'utils')
            .leftJoinAndSelect('post.postGalleries', 'postGalleries')
            .where(where)
            .orderBy('post.id', 'DESC')
            .getOne()

        return post
    }


    public async update({
        post, postId, addressCityId, addressDistrictId, addressWardId, utilIds, images
    }: UpdatePostParams) {
        post.id = +postId

        // Luu dia chi
        if (addressCityId) await post.assignAddressCity(addressCityId)
        if (addressDistrictId) await post.assignAddressDistrict(addressDistrictId)
        if (addressWardId) await post.assignAddressWard(addressWardId)

        // Luu tien ich
        if (utilIds && utilIds.length) {
            await post.assignUtils(utilIds)
        }

        // Luu hinh anh
        if (images && images.length) {
            await post.assignGalleries(images)
        }

        await post.save()

        return post
    }


    public async mapFavorite(posts: Post[], customerId: number) {
        const postIds = posts.map(p => p.id)
        if (!customerId) {
            posts.map(p => p.isFavorite = false)
            return posts
        }

        let where = `customer.id = ${customerId}
            AND post.id  IN (:...postIds) `

        const favoritePosts = await PostFavorite.createQueryBuilder('postFavorite')
            .leftJoin('postFavorite.customer', 'customer')
            .leftJoinAndSelect('postFavorite.post', 'post')
            .where(where, { postIds })
            .orderBy('postFavorite.id', 'DESC')
            .getMany()

        posts.map(p => {
            if (favoritePosts.some(f => f.post.id == p.id)) {
                p.isFavorite = true
            } else {
                p.isFavorite = false
            }
        })

        return posts
    }


    public async isFavorite(postId: number, customerId: number) {
        if (!customerId) return false

        let where = `customer.id = :customerId
            AND post.id = :postId `

        const favoritePost = await PostFavorite.createQueryBuilder('postFavorite')
            .leftJoin('postFavorite.customer', 'customer')
            .leftJoinAndSelect('postFavorite.post', 'post')
            .where(where, { postId, customerId })
            .getOne()

        return !!favoritePost
    }

} //END FILE
