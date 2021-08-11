import { createLogger, format, transports } from 'winston'
import moment from 'moment';
import fs from 'fs';
import CONFIG from '../../config';

const { combine, timestamp, label, printf } = format;
const timestampFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();
const loggerFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestampFormat()} [${label}] ${level.toUpperCase()}: ${message}`;
});

function dailyRotateFileTransport(type: string) {
    const logPath = `${CONFIG.LOG_DIR}/${type}`

    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath);
    }

    return new transports.File({
        filename: `${logPath}/log-${moment().format('YYYY-MM-DD')}.log`,
    });
}

function logger(type: string) {
    return createLogger({
        level: 'info',
        format: combine(
            label({ label: `${CONFIG.APPLICATION_NAME}` }),
            timestamp(),
            loggerFormat
        ),
        transports: [
            dailyRotateFileTransport(type),
            new transports.Console({
                silent: true,
                format: format.combine(
                    format.colorize(),
                    format.printf(
                        info => `${timestampFormat()} ${info.level}: ${info.message}`
                    )
                )
            })
        ],
    })
}

export default logger
