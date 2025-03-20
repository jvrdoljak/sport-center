import { Enrollment } from "src/enrollments/entities/enrollment.entity";
import { Sport } from "src/sports/entities/sport.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("class")
export class Class {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	schedule: Date;

	@Column({ type: "int" })
	durationMins: number;

	@Column()
	description: string;

	@Column({ type: "int" })
	capacity: number;

	@Column({ type: "uuid" })
	sportId: string;

	@ManyToOne(() => Sport, (sport) => sport.classes)
	@JoinColumn({ name: "sportId" })
	sport: Sport;

	@OneToMany(() => Enrollment, (enrollment) => enrollment.class)
	enrollments: Enrollment[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	modifiedAt: Date;
}
