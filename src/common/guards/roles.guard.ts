import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../constants/response.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest();

    if (!user) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        error_message:
          ERROR_MESSAGES[ERROR_CODES.FORBIDDEN](
            'resource',
          ),
      });
    }

    const hasRole = requiredRoles.some(
      (role) => user.role === role,
    );

    if (!hasRole) {
      throw new ForbiddenException({
        code: ERROR_CODES.FORBIDDEN,
        error_message:
          ERROR_MESSAGES[ERROR_CODES.FORBIDDEN](
            'resource',
          ),
      });
    }

    return true;
  }
}
