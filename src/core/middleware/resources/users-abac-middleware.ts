import { Ability, AbilityBuilder, defineAbility, subject } from "@casl/ability";
import { ForbiddenException, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Content } from "src/contents/contents.service";
import { UrlHelper } from "src/core/utils/url.helper";
import { User, UsersService } from "src/users/users.service";
import { Action } from "./casl-type";

@Injectable()
export class UsersAbacMiddleware implements NestMiddleware {

  private resrc = 'User';
  private url = '';

  constructor(
    private usersSvc: UsersService, 
    private urlHelper: UrlHelper) { }

  async use(req: any, res: any, next: () => void) {
    this.url = req.url;

    const loginedUser = req.user;
    const ability = this.defineAbilitiesFor(loginedUser);

    if(!req.route.methods.post) {
      const id = this.urlHelper.getResourceId(this.url, 'users');
      const targetUser = id? await this.usersSvc.getUserById(id, false, true) : null;

      if(!targetUser) { throw new NotFoundException(); }
      if(req.route.methods.get) { 
        if(!ability.can(Action.Read, this.resrc)) { throw new ForbiddenException(); }
      }else {
        const srcUser = req.body.data;
        if(!ability.can(Action.Manage, subject(this.resrc, targetUser)) 
        || !ability.can(Action.Manage, subject(this.resrc, srcUser))) { throw new ForbiddenException(); }
      }
    }

    console.debug('users abac finished', loginedUser)
    next();
  }
  
  private defineAbilitiesFor = (user: User) => {
    const { can, rules } = new AbilityBuilder(Ability);

    if(user.role === 'admin') { can(Action.Manage, Content); }
    else {
      if(this.url.includes('subscribers')) { can(Action.Read, this.resrc, { id: user.id });
      }else {
        can(Action.Read, this.resrc);
      }

      can(Action.Manage, this.resrc, { id: user.id });
    }
  
    return new Ability(rules);
  };
  
}