
import { ICreateUser, type IUser } from "./user.dto";
import UserSchema from "./user.schema";

export const createUser = async (data: ICreateUser) => {
    const result = await UserSchema.create({ ...data, active: true });
    return result.toObject();
};

export const updateUser = async (id: string, data: Partial<ICreateUser>) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteUser = async (id: string) => {
    const result = await UserSchema.deleteOne({ _id: id });
    return result;
};

export const getUserById = async (id: string) => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

export const getAllUser = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
};




export const getUserByEmail = async (email: string, withPassword = false): Promise<IUser | null> => {
    let query = UserSchema.findOne({ email }).select("_id name email active role password");

  

    const user = await query.lean(); 
    return user as IUser | null; // ✅ Explicitly cast the return type
};
