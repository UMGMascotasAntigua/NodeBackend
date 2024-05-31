import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "src/modules/auth/auth.service";
import { Role } from "src/utils/rbac/role.enum";
import { ROLES_KEY } from "src/utils/rbac/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private reflector: Reflector, private authService: AuthService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = await this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        console.log('Required roles in guard:', requiredRoles);
        if (!requiredRoles) {
          return true;
        }
    
        const { user } = context.switchToHttp().getRequest();
        console.log('User from request:', user);
        const profile = await this.authService.getUserLevel(user);
        console.log('User profile:', profile);

        if(!profile){
          return false;
        }

        return requiredRoles.some((role) => profile.Perfil.Descripcion?.includes(role));
      }
}