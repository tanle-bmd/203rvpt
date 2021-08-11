import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, Post, BodyParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';

import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Role } from '../../entity/Role';
import { RoleService } from '../../services/RoleService';
import { Permission } from '../../entity/Permission';
import { PermissionImport } from '../../entity-request/PermissionImport';

@Controller("/admin/role")
@Docs("docs_admin")
export class RoleController {
    constructor(
        private roleService: RoleService
    ) { }


    // =====================CREATE ITEM=====================
    @Post('')
    @UseAuth(VerificationJWT)
    @Validator({
        role: Joi.required(),
        token: Joi.required()
    })
    async create(
        @BodyParams("role") role: Role,
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        await role.save()

        return res.sendOK({ id: role.id })
    }


    // =====================GET LIST=====================
    @Get('')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async findAll(
        @Res() res: Response,
        @Req() req: Request,
        @HeaderParams("token") token: string,
    ) {
        const roles = await Role.find()

        return res.sendOK(roles)
    }


    // =====================IMPORT PERMISSIONS=====================
    @Post('/permissions/import')
    @UseAuth(VerificationJWT)
    @Validator({
        permissions: Joi.required(),
        token: Joi.required()
    })
    async importPermission(
        @BodyParams("permissions", PermissionImport) permissionImports: PermissionImport[],
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const permissions = await this.roleService.import(permissionImports)
        await this.roleService.resetRoleForAdmin(permissions)

        return res.sendOK(permissions)
    }


    // =====================GET PERMISSION=====================
    @Get('/permissions')
    @UseAuth(VerificationJWT)
    @Validator({
        token: Joi.required()
    })
    async getAllPermission(
        @Res() res: Response,
        @Req() req: Request,
        @HeaderParams("token") token: string,
    ) {
        const permissions = await Permission.find()

        return res.sendOK(permissions)
    }


    // =====================GET ITEM=====================
    @Get('/:roleId')
    @UseAuth(VerificationJWT)
    @Validator({
        roleId: Joi.number().required(),
        token: Joi.required()
    })
    async getRole(
        @PathParams("roleId") roleId: number,
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const role = await Role.findOne(roleId, {
            relations: ["permissions"]
        })

        return res.sendOK(role)
    }


    // =====================UPDATE ROLE=====================
    @Post('/:roleId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        roleId: Joi.number().required(),
        permissionIds: Joi.required(),
        token: Joi.required()
    })
    async turnOnPermissionInRole(
        @HeaderParams("token") token: string,
        @Res() res: Response,
        @Req() req: Request,
        @PathParams("roleId") roleId: number,
        @BodyParams("permissionIds", Number) permissionIds: number[],
        @BodyParams("info") role: Role,
    ) {
        await Role.findOneOrThrowId(+roleId)

        const permissions = await Permission.createQueryBuilder('permission')
            .where(`id IN (:...permissionIds)`, { permissionIds })
            .getMany()

        role.id = +roleId
        role.permissions = permissions
        await role.save()

        return res.sendOK(role)
    }

} // END FILE
