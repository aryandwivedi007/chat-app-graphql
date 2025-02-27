import mongoose from "mongoose";
import { IMessage } from "./message.dto";

const Schema = mongoose.Schema;


const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  }, { timestamps: true });
  
  export default mongoose.model<IMessage>("Message", MessageSchema);

