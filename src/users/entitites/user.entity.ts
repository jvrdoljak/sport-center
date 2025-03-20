import { Role } from "src/common/enums/role";
import { Enrollment } from "src/enrollments/entities/enrollment.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	role: Role;

	@OneToMany(() => Enrollment, (enrollment) => enrollment.user)
	enrollments: Enrollment[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	modifiedAt: Date;
}
