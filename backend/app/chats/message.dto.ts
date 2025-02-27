import mongoose from "mongoose";
import { BaseSchema } from "../common/dto/base.dto";
export interface IMessage extends BaseSchema {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
  }