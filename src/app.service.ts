import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	/**
	 *
	 * @returns string
	 */
	getHello(): string {
		return "Welcome to the Sport Center App.\n\n\
		For documentation go to the <a href='/api/docs'>/api/docs</a>";
	}
}
