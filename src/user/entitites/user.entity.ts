import { Role } from "src/common/enums/role";
import { Enrollment } from "src/enrollment/entities/enrollment.entity";
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

	@Column({ select: false }) // Disable password on return. Use addSelect if you need.
	password: string;

	@Column()
	role: Role;

	@OneToMany(() => Enrollment, (enrollment) => enrollment.user)
	enrollments: Enrollment[] | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	modifiedAt: Date;
}
