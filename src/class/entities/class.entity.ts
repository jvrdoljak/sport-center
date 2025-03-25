import { Enrollment } from "src/enrollment/entities/enrollment.entity";
import { Sport } from "src/sport/entities/sport.entity";
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

	@Column({ type: "json" })
	schedule: {
		day: string;
		startTime: string;
		endTime: string;
	}[];

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
