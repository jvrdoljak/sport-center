import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("class")
export class Class {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	schedule: Date;

	@Column()
	durationMins: number;

	@Column()
	description: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	modifiedAt: Date;
}
