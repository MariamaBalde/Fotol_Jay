import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
@Injectable()
export class AdminGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true; // Si pas de rôles requis, autoriser
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user?.role?.includes(role));
    }
}
//# sourceMappingURL=admin.guard.js.map