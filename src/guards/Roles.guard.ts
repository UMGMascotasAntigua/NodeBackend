import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "src/modules/auth/auth.service";
import { Role } from "src/utils/rbac/role.enum";
import { ROLES_KEY } from "src/utils/rbac/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private reflector: Reflector, private authService: AuthService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (!requiredRoles) {
          return true;
        }
    
        const request = context.switchToHttp().getRequest<Request>();
        const user = request['user'];
        const profile = await this.authService.getUserLevel(user);

        return requiredRoles.some((role) => profile.Perfil.Descripcion?.includes(role));
      }
}