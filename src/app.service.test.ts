import { AppService } from "./app.service";

describe("AppService", () => {
	let appService: AppService;

	beforeEach(() => {
		appService = new AppService();
	});

	describe("getHello", () => {
		it("should return welcome message", () => {
			const result =
				"Welcome to the Sport Center App.\n\n\t\tFor documentation go to the <a href='/api/docs'>/api/docs</a>";
			expect(appService.getHello()).toBe(result);
		});
	});
});
