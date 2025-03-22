import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	/**
	 *
	 * @returns string
	 */
	getHello(): string {
		return "Welcome to the Sport Center App.";
	}
}
