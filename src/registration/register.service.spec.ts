import { UsersService } from "../users/users.service";
import { RegisterService } from "./register.service";

describe('RegistrationService', () => {

  let svc: RegisterService;
  let usersSvc: UsersService;

  beforeEach(async () => {
    usersSvc = new UsersService(null);
    svc = new RegisterService(usersSvc);
  });

  it('should be defined', () => {
    expect(svc).toBeDefined();
  });

  describe('register', () => {
    it('should create user if user not existed', async () => {
      jest.spyOn(usersSvc, 'getUserByEmail').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(usersSvc, 'createUser').mockImplementation(() => Promise.resolve(null));

      await svc.register({
        email: 'test-user@podcast-hk.com'
      });

      expect(usersSvc.createUser).toHaveBeenCalled();
    });

    it('should return user if user existed', async () => {
      let result: any = { email: 'test-user@podcast-hk.com' };
      jest.spyOn(usersSvc, 'getUserByEmail').mockImplementation(() => Promise.resolve(result));

      const user = await svc.register({
        email: 'test-user@podcast-hk.com'
      });

      expect(user).toEqual(result);
    });

  });


});