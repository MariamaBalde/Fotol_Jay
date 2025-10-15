import { SetMetadata } from '@nestjs/Common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
//# sourceMappingURL=roles.decorator.js.map