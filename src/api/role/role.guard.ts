import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UserService} from "../user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(UserService) private usersService: UserService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean>{
        //Get assigned Role to route
        const roles = this.reflector.getAllAndOverride<string[]>(
            "roles",
            [context.getHandler(), context.getClass()]
        );

        console.log(roles)
        if (!roles || !roles.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log(user)
        if (!user) {
            return false;
        }

        let dbUser = await this.usersService.getOne(user.username);
        console.log(dbUser?.role)
        if(!dbUser || !dbUser.role || !roles.includes(dbUser.role)){
            return false;
        }

        return true;
    }
}
