import { regularExps } from "../../../config";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ["name is required"];
    if (typeof name !== "string") return ["name must be a string"];
    if (!email) return ["email is required"];
    if (typeof email !== "string") return ["email must be a string"];
    if (!regularExps.email.test(email)) return ["email is invalid"];
    if (!password) return ["password is required"];
    if (password.length < 8)
      return ["password must be at least 8 characters long"];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
