
import * as userService from "../user/user.service";
import { createUserTokens } from "../common/services/passport-jwt.service";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import MessageModel from "../chats/message.schema"; 
import UserModel from "../user/user.schema"; // ✅ Ensure the correct import

import { IMessage } from "../chats/message.dto";

const resolvers = {
  Query: {
    /**
     * Get all users (Admin Only)
     */
    getLoggedInUser: async (_: any, __: any, context: { user?: any }) => {
      // ✅ Ensure the user is logged in
      if (!context.user) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
    
      // ✅ Fetch user details from the database
      const loggedInUser = await UserModel.findById(context.user._id).select("id name email role active");
    
      if (!loggedInUser) {
        throw new GraphQLError("User not found");
      }
    
      return loggedInUser;
    },
    
    getUsers: async (_: any, __: any, context: { user?: any }) => {
      // if (!context.user) throw new GraphQLError("Unauthorized");

      const users = await userService.getAllUser();

      
      return users.map((user: any) => ({
        id: user._id?.toString() ?? "", 
        name: user.name ?? "Unknown",   
        email: user.email ?? "",
        active: user.active ?? false,
        role: user.role ?? "USER"
      }));
    },

    /**
     * Get a single user (Only the logged-in user or Admin)
     */
    getUser: async (_: any, { id }: { id: string }, context: { user?: any }) => {
      // if (!context.user) throw new GraphQLError("Unauthorized");

      // if (context.user.role !== "ADMIN" && context.user.id !== id) {
      //   throw new GraphQLError("Forbidden");
      // }

      return await userService.getUserById(id);
    },


    getMessages: async (
        _: any,
        { senderId, receiverId }: { senderId: string; receiverId: string },
        context: { user?: any } // ✅ Ensure context is passed
      ) => {
        
        if (!context.user) {
          throw new GraphQLError("Unauthorized", {
            extensions: { code: "UNAUTHENTICATED" }, // Custom error code
          });
        }
        

    
        if (context.user._id !== senderId && context.user._id !== receiverId) {
          throw new GraphQLError("Forbidden: You are not part of this conversation", {
            extensions: { code: "FORBIDDEN" },
          });
        }
      
        
        return await MessageModel.find({
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        })
          .sort({ createdAt: 1 })
          .populate({ path: "sender", model: "user", select: "name email" }) // Ensure correct model name
          .populate({ path: "receiver", model: "user", select: "name email" });
      },
      
  },

  Mutation: {
    /**
     * Register a new user
     */
    register: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      try {
        const user = await userService.createUser({
          name,
          email,
          password,
          active: true,
          role: "USER",
        });

        if (!user._id) {
          throw new GraphQLError("User creation failed: Missing ID.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          active: user.active,
          role: user.role,
          token: null,
        };
      } catch (error: any) {
        throw new GraphQLError(error.message);
      }
    },

    /**
     * Login a user and return JWT tokens
     */
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        const user = await userService.getUserByEmail(email, true);
        if (!user) throw new GraphQLError("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new GraphQLError("Invalid credentials");

        const { accessToken, refreshToken } = createUserTokens({
          _id: user._id as string,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

        return { accessToken, refreshToken };
      } catch (error: any) {
        throw new GraphQLError(error.message);
      }
    },

    /**
     * Update a user's details
     */
    updateUser: async (_: any, args: { id: string; name?: string; email?: string; active?: boolean; role?: string }, context: { user?: any }) => {
      if (!context.user) throw new GraphQLError("Unauthorized");

      const filteredUpdates = Object.fromEntries(
        Object.entries(args).filter(([_, v]) => v !== undefined)
      );

      return await userService.updateUser(args.id, filteredUpdates);
    },

    /**
     * Delete a user (Admin Only)
     */
    deleteUser: async (_: any, { id }: { id: string }, context: { user?: any }) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      if (context.user.role !== "ADMIN") throw new GraphQLError("Forbidden");

      return await userService.deleteUser(id);
    },

    /**
     * Send a new message
     */
    sendMessage: async (
        _: any,
        
        args: { senderId: string; receiverId: string; content: string },
        context: { user?: any },
      ) => {
        const { senderId, receiverId, content } = args;
      
        // const sender = await userSchema.findById(senderId);
        // const receiver = await userSchema.findById(receiverId);
      
        // if (!sender || !receiver) {
        //   throw new GraphQLError("Sender or receiver not found");
        // }
      
        const message = new MessageModel({ sender: senderId, receiver:receiverId, content });
        await message.save();
        const populatedMessage = await MessageModel.findById(message._id)
    .populate({ path: "sender", model: "user", select: "name email" }) // ✅ Ensure correct model name
    .populate({ path: "receiver", model: "user", select: "name email" });


        return populatedMessage;
      }
      
      
  },
};

export default resolvers;
