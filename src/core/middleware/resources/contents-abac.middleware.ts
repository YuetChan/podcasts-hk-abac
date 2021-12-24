import { Ability, AbilityBuilder, defineAbility, subject } from "@casl/ability";
import { ForbiddenException, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Content, ContentsService } from "src/contents/contents.service";
import { UrlHelper } from "src/core/utils/url.helper";
import { User } from "src/users/users.service";
import { Action } from "./casl-type";

@Injectable()
export class ContentsAbacMiddleware implements NestMiddleware {

  private resrc = 'Content';

  constructor(
    private readonly contentsSvc: ContentsService, 
    private urlHelper: UrlHelper) { }

  async use(req: any, res: any, next: () => void) {
    const loginedUser = req.user;
    const ability = this.defineAbilitiesFor(loginedUser);

    if(!req.route.methods.post){
      const id = this.urlHelper.getResourceId(req.url, 'contents');
      const targetContent = id? await this.contentsSvc.getContentById(id) : null;

      if(!targetContent) { throw new NotFoundException(); }
      if(req.route.methods.get) { 
        if(!ability.can(Action.Read, this.resrc)) { throw new ForbiddenException(); }
      }else {
        const srcContent = req.body.data;
        if(!ability.can(Action.Manage, subject(this.resrc, targetContent)) 
        || !ability.can(Action.Manage, subject(this.resrc, srcContent))) { throw new ForbiddenException(); }
      }

    }else {
      const srcContent = req.body.data;
      if(!ability.can(Action.Manage, subject(this.resrc, srcContent))) { throw new ForbiddenException(); }
    }
 
    console.log('contents abac finished', loginedUser)
    next();
  } 

  private defineAbilitiesFor = (user: User) => {
    const { can, rules } = new AbilityBuilder(Ability);

    if(user.role === 'admin') { can(Action.Manage, this.resrc); }
    else {
      can(Action.Read, this.resrc);
      can(Action.Manage, this.resrc, { userId: user.id });
    }
  
    return new Ability(rules);
  };

}

