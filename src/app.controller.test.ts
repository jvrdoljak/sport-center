import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
	let appController: AppController;
	let appService: AppService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = module.get<AppController>(AppController);
		appService = module.get<AppService>(AppService);
	});

	describe("getHello", () => {
		it("should return welcome message", () => {
			const result =
				"Welcome to the Sport Center App.\n\n        For documentation go to the <a href='/api/docs'>/api/docs</a>";
			jest.spyOn(appService, "getHello").mockReturnValue(result);

			expect(appController.getHello()).toBe(result);
		});
	});
});
