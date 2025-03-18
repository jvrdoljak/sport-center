import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { User } from "./entitites/user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	/**
	 * findAll
	 */
	async findAll(): Promise<Array<User>> {
		return await this.usersRepository.find();
	}

	/**
	 * findOne
	 */
	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findOneBy({ id });
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	/**
	 * createOne
	 */
	async createOne(createUserDto: CreateUserDto): Promise<User> {
		const existingUser = await this.usersRepository.findOne({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new ConflictException("Email already exists");
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		const user = this.usersRepository.create({
			...createUserDto,
			password: hashedPassword,
		});

		return this.usersRepository.save(user);
	}

	/**
	 * updateOne
	 */
	async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.usersRepository.findOneBy({ id });

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		if (updateUserDto.password) {
			updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
		}

		Object.assign(user, updateUserDto);

		return this.usersRepository.save(user);
	}

	async remove(id: string): Promise<void> {
		const result = await this.usersRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}

	/**
	 * deleteOne
	 */
	async deleteOne(id: string): Promise<void> {
		const result = await this.usersRepository.delete({ id });

		if (result.affected === 0) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}
}
