import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data/mongo";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  //DI - Dependency Injection
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existsUser = await UserModel.findOne({
      email: registerUserDto.email,
    });

    if (existsUser)
      throw CustomError.badRequest(
        "Error User no register please try again - email already exists"
      );

    try {
      const user = new UserModel(registerUserDto);

      //Encrypt password
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      //Email confirmation
      await this.sendEmailValidationLink(user.email!);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return userEntity;
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user)
      throw CustomError.badRequest(
        "Bad credentials - Email or password invalid"
      );

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password as string
    );
    if (!isMatching)
      throw CustomError.badRequest(
        "Bad credentials - Password or email invalid"
      );

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: userEntity.id });
    if (!token) throw CustomError.internalServerError("Error generating token");

    return {
      user: userEntity,
      token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServerError("Error generating token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const htmlBody = `
      <h1>Validate your email</h1>
      <p>Click <a href="${link}">here</a> to validate your email ${email}</p>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServerError("Error sending email");

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.badRequest("Email not found in token");

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.badRequest("User not found");

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
