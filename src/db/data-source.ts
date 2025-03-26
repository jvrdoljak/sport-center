import {
	DATABASE_HOST,
	DATABASE_NAME,
	DATABASE_PASSWORD,
	DATABASE_PORT,
	DATABASE_USERNAME,
} from "src/common/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
	type: "mysql",
	host: DATABASE_HOST,
	port: DATABASE_PORT,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD,
	database: DATABASE_NAME,
	entities: [__dirname + "/../**/*.entity{.ts,.js}"],
	migrations: ["src/db/migrations/*.ts"],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
