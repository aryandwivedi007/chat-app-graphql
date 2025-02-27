
import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
        name: string;
        email: string;
        active?: boolean;
        role: "USER" | "ADMIN";
        password: string
}





export interface ICreateUser  {
        name: string;
        email: string;
        active?: boolean;
        role: "USER" | "ADMIN";
        password: string
}
