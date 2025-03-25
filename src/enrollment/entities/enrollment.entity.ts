import { Class } from "src/class/entities/class.entity";
import { User } from "src/user/entitites/user.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("enrollment")
export class Enrollment {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "uuid" })
	userId: string;

	@Column({ type: "uuid" })
	classId: string;

	@ManyToOne(() => User, (user) => user.enrollments)
	@JoinColumn({ name: "userId" })
	user: User;

	@ManyToOne(() => Class, (sportClass) => sportClass.enrollments)
	@JoinColumn({ name: "classId" })
	class: Class;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
