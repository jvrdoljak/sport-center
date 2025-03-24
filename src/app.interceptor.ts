import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class AppInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((err) => {
				return throwError(() => ({
					statusCode: err.status || 500,
					error: err.name || "Internal Server Error",
					message: err.message || "Something went wrong",
				}));
			}),
		);
	}
}
