import { regularExps } from "../../../config";

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ["Email is required"];
    if (!regularExps.email.test(email)) return ["Email is invalid"];
    if (!password) return ["Password is required"];
    if (password.length < 8)
      return ["Password must be at least 8 characters long"];
    if (typeof password !== "string") return ["Password must be a string"];

    return [undefined, new LoginUserDto(email, password)];
  }
}
