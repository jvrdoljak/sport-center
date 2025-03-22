import {
	ForbiddenException,
	Injectable,
	type CanActivate,
	type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		if (!user) {
			throw new ForbiddenException(
				`Authentification error: User is not found in payload.`,
			);
		}
		return requiredRoles.some((role) => user.roles?.includes(role));
	}
}
