import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";
import { logger } from "src/logger";

@Injectable()
export class AppInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((err) => {
				logger.error(`Error intercepted: ${err.message}`);

				return throwError(() => ({
					statusCode: err.status || 500,
					error: err.name || "Internal Server Error",
					message: err.message || "Something went wrong",
				}));
			}),
		);
	}
}
