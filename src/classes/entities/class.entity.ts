import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("class")
export class Class {
	@PrimaryGeneratedColumn("uuid")
	id: number;

	@Column()
	schedule: Date;

	@Column()
	durationMins: number;

	@Column()
	description: string;

	@Column()
	createdAt: Date;

	@Column()
	modifiedAt: Date;
}
