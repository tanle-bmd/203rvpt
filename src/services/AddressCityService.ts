// IMPORT LIBRARY
import { Service } from "@tsed/common";


// IMPORT CUSTOM
import { AddressCity } from "../entity/AddressCity";

@Service()
export class AddressCityService {

    public async getManyAndCount({ page, limit, search }) {
        const [addressCity, total] = await AddressCity.createQueryBuilder('city')
            .where(`city.name LIKE "%${search}%"`)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('city.priority', 'DESC')
            .addOrderBy('city.id', 'DESC')
            .getManyAndCount()
        return [addressCity, total]
    }

} //END FILE
