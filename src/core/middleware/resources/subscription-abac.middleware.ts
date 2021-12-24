import { Ability, AbilityBuilder, subject } from "@casl/ability";
import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { User } from "src/users/users.service";
import { Action } from "./casl-type";

@Injectable()
export class SubscriptionsAbacMiddleware implements NestMiddleware {

  private resrc = 'Subscription';

  constructor() { }

  async use(req: any, res: any, next: () => void) {
    const loginedUser = req.user;
    const ability = this.defineAbilitiesFor(loginedUser);

    const targetSubscription = req.body.data;

    if(req.route.methods.post) { 
      if(!ability.can(Action.Manage, subject(this.resrc, { subscriberId: targetSubscription.subscriberId }))) {
        throw new ForbiddenException();
      } 
    }

    console.debug('subscriptions abac finished', loginedUser);
    next();
  }
  
  private defineAbilitiesFor = (user: User) => {
    const { can, rules } = new AbilityBuilder(Ability);

    if(user.role === 'admin') { can(Action.Manage, this.resrc); }
    else {
      can(Action.Manage, this.resrc, { subscriberId: user.id });
    }
  
    return new Ability(rules);
  };
  
}