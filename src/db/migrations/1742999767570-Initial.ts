import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1742999767570 implements MigrationInterface {
	name = "Initial1742999767570";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifiedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`enrollment\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`classId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`sport\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifiedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6a16e1d83cb581484036cee92b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`class\` (\`id\` varchar(36) NOT NULL, \`schedule\` json NOT NULL, \`durationMins\` int NOT NULL, \`description\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`sportId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modifiedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`enrollment\` ADD CONSTRAINT \`FK_e97ecbf11356b5173ce7fb0b060\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`enrollment\` ADD CONSTRAINT \`FK_e6f7c2bb07e0ca61c0c103a0720\` FOREIGN KEY (\`classId\`) REFERENCES \`class\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`class\` ADD CONSTRAINT \`FK_8b480ee07908d5424bd8779f68d\` FOREIGN KEY (\`sportId\`) REFERENCES \`sport\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`class\` DROP FOREIGN KEY \`FK_8b480ee07908d5424bd8779f68d\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`enrollment\` DROP FOREIGN KEY \`FK_e6f7c2bb07e0ca61c0c103a0720\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`enrollment\` DROP FOREIGN KEY \`FK_e97ecbf11356b5173ce7fb0b060\``,
		);
		await queryRunner.query(`DROP TABLE \`class\``);
		await queryRunner.query(
			`DROP INDEX \`IDX_6a16e1d83cb581484036cee92b\` ON \`sport\``,
		);
		await queryRunner.query(`DROP TABLE \`sport\``);
		await queryRunner.query(`DROP TABLE \`enrollment\``);
		await queryRunner.query(
			`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
		);
		await queryRunner.query(`DROP TABLE \`users\``);
	}
}
