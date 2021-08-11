// IMPORT LIBRARY
import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import "@tsed/typeorm";
import Path from "path";
import compression from "compression";
import bodyParser from "body-parser";
import cors from 'cors';
import methodOverride from 'method-override';
import timezone from 'moment-timezone';
import multer from "multer";
import moment from "moment";
import fs from 'fs';
import md5 from 'md5';
import "@tsed/swagger";
import "@tsed/multipartfiles";
import { ServerOptions } from "https";

// IMPORT CUSTOM
import responseAPI from './middleware/response/responseAPI';
import handleError from "./middleware/error/handleError";
import handleNotFound from "./middleware/error/handleNotFound";
import logger from './util/logger';
import './middleware/response/CustomSendResponse';
import CONFIG from "../config";
import { logSection } from "./util/helper";

interface ProtocolPorts {
    httpsPort: string | boolean
    httpPort: string | boolean
}

// TIMEZONE
timezone.tz.setDefault("Asia/Ho_Chi_Minh");


// HANDLE HTTP/HTTPS
function handleProtocolPort(): ProtocolPorts {
    if (process.env.PRODUCTION_MODE == "1")
        return {
            httpsPort: `${CONFIG.HOST}:${CONFIG.PORT}`,
            httpPort: false
        }

    return {
        httpPort: `${CONFIG.HOST}:${CONFIG.PORT}`,
        httpsPort: false
    }
}

function handleHttpsOptions(): ServerOptions {
    if (process.env.PRODUCTION_MODE == "1") {
        logSection('production mode')
        return {
            cert: fs.readFileSync(CONFIG.SSL),
            key: fs.readFileSync(CONFIG.SSL),
            ca: fs.readFileSync(__dirname + "/ssl/certificate-ca.crt")
        }
    }

    logSection('development mode')
    return {}
}


// HANDLE MULTER UPLOAD
function handleStorage(): multer.StorageEngine {
    return multer.diskStorage({
        destination: (
            req: Express.Request, file: Express.Multer.File,
            callback: (error: Error | null, destination: string) => void
        ) => {
            const controller = req.ctx.endpoint.targetName
            const des = controller.replace("Controller", "").toLowerCase()
            if (!des) {
                callback(new Error("Wrong controller"), null)
            } else {
                const uploadPath = `${CONFIG.UPLOAD_DIR}/${des}`
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath);
                }
                callback(null, uploadPath)
            }
        },
        filename: (
            req: Express.Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void
        ) => {
            if (!file.mimetype.includes("image"))
                return callback(new Error("Invalidate file's extend name "), null)
            else callback(null, md5(file.filename + moment().valueOf().toString()) + Path.extname(file.originalname))
        }
    });
}


// SERVER
const OPTION: any = {
    httpsOptions: handleHttpsOptions(),
    rootDir: __dirname,
    socketIO: {},
    statics: {
        "/": `${CONFIG.STATIC_DIR}`
    },
    acceptMimes: ["application/json"],
    mount: {
        [CONFIG.PREFIX_URL]: `${__dirname}/controllers/**/**Controller.{ts,js}`
    },
    swagger: [
        {
            path: "/docs_admin",
            doc: "docs_admin"
        },
        {
            path: "/docs_customer",
            doc: "docs_customer"
        }
    ],
    typeorm: [
        CONFIG.TYPE_ORM
    ],
    multer: {
        storage: handleStorage(),
    },
    logger: {
        // logStart: false,
        format: `%[%d{[hh:mm:ss dd/MM/yyyy}] %p%] %m`,
        requestFields: ["method", "url", "body", "query", "params"]
    }
}


const PORT = handleProtocolPort()
@ServerSettings({ ...OPTION, ...PORT })
export class Server extends ServerLoader {

    public $beforeRoutesInit(): void | Promise<any> {
        this.use(GlobalAcceptMimesMiddleware)
            .use(cors())
            .use(compression())
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(responseAPI)

        return null;
    }

    public $onReady() {
        logSection('server started')
        logger('info').info(`SERVER RESTART AT ${moment().format("YYYY-MM-DD HH:mm:ss")}`)
    }

    public $afterRoutesInit() {
        this.use(handleNotFound)
            .use(handleError)
    }

    public $onServerInitError(err: any) {
        console.error(err);
        logger('error').error("Error On Server Init: ", JSON.stringify(err))
    }
}
