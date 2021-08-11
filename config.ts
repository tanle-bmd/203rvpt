const SECONDS_IN_1_YEAR = 60 * 60 * 24 * 30 * 12

const CONFIG = {
    APPLICATION_NAME: process.env.APPLICATION_NAME,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    PREFIX_TABLE: process.env.DATABASE_PREFIX_TABLE,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: SECONDS_IN_1_YEAR,
    LOG_DIR: process.env.LOG_DIR,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
    STATIC_DIR: process.env.STATIC_DIR,
    PREFIX_URL: process.env.PREFIX_URL,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    SSL: process.env.SSL,
    TYPE_ORM: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        bigNumberStrings: false,
        name: 'default',
        charset: 'utf8mb4',
        synchronize: true,
        entities: [
            `${__dirname}/src/entity/*{.ts,.js}`
        ],
        migrations: [
            `${__dirname}/src/migrations/*{.ts,.js}`
        ],
        subscribers: [
            `${__dirname}/src/subscriber/*{.ts,.js}`
        ]
    }
}

export default CONFIG
