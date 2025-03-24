import { WinstonModule } from "nest-winston";
import * as winston from "winston";

const logger = WinstonModule.createLogger({
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.colorize(),
				winston.format.printf(({ level, message, timestamp }) => {
					return `[${timestamp}] ${level}: ${message}`;
				}),
			),
		}),
		new winston.transports.File({ filename: "logs/app.log" }),
	],
});

export { logger };
