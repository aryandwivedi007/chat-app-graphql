
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_MESSAGES, GET_LOGGED_IN_USER } from "../graphql/query";
import { SEND_MESSAGE } from "../graphql/mutation";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Avatar,
} from "@mui/material";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_LOGGED_IN_USER);
  const loggedInUser = userData?.getLoggedInUser;

  const { loading, error, data } = useQuery(GET_USERS);

  const { loading: msgLoading, data: msgData, refetch } = useQuery(GET_MESSAGES, {
    variables: { senderId: loggedInUser?.id, receiverId: selectedUser?.id },
    skip: !loggedInUser || !selectedUser,
    pollInterval: 3000,
  });

  const [sendMessage, { loading: sendLoading, error: sendError }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Send Message Error:", error.message),
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgData]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser || !loggedInUser) return;

    try {
      await sendMessage({
        variables: {
          senderId: loggedInUser.id,
          receiverId: selectedUser.id,
          content: message,
        },
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (userLoading || loading) return <CircularProgress />;
  if (userError || error) return <Typography color="error">{userError?.message || error?.message}</Typography>;

  return (
    <Box display="flex" height="90vh" bgcolor="#121212" p={2}>
      {/* Left Sidebar (User List) */}
      <Paper sx={{ width: "30%", height: "100%", overflowY: "auto", p: 2, borderRadius: "12px", bgcolor: "#1E1E1E" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#ffffff" }}>
          Users
        </Typography>
        <List>
          {data?.getUsers?.map((user) => (
            <ListItem
              button
              key={user.id}
              selected={selectedUser?.id === user.id}
              onClick={() => setSelectedUser(user)}
              sx={{
                borderRadius: "8px",
                mb: 1,
                bgcolor: selectedUser?.id === user.id ? "#333333" : "transparent",
                "&.Mui-selected": { bgcolor: "#444444" },
              }}
            >
              <Avatar sx={{ mr: 2, bgcolor: "#1F7A1F" }}>{user.name.charAt(0)}</Avatar>
              <ListItemText primary={user.name} secondary={user.email} sx={{ color: "#ffffff" }} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Right Chat Section */}
      <Box sx={{ width: "70%", display: "flex", flexDirection: "column", p: 2 }}>
        {selectedUser ? (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#ffffff",
                bgcolor: "#1E1E1E",
                p: 2,
                borderRadius: "12px",
                textAlign: "center",
                mb: 2,
              }}
            >
              Chat with {selectedUser.name}
            </Typography>

            <Paper
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                mb: 2,
                maxHeight: "65vh",
                borderRadius: "12px",
                bgcolor: "#1E1E1E",
              }}
            >
              {msgLoading ? (
                <CircularProgress />
              ) : msgData?.getMessages?.length > 0 ? (
                msgData.getMessages.map((msg) => {
                  const isSender = msg.sender.id === loggedInUser.id;
                  const messageAlignment = isSender ? "flex-end" : "flex-start";
                  const senderName = loggedInUser.name;
                  const receiverName = msg.receiver.name;

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: messageAlignment,
                        flexDirection: "column",
                        alignItems: isSender ? "flex-end" : "flex-start",
                      }}
                    >
                      {/* Sender/Receiver Label */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: isSender ? "#1F7A1F" : "#bbbbbb",
                          mb: 0.5,
                        }}
                      >
                        {isSender ? senderName : receiverName}
                      </Typography>

                      {/* Message Bubble */}
                      <Paper
                        sx={{
                          p: 1.5,
                          borderRadius: "6px",
                          bgcolor: isSender ? "#1F7A1F" : "#282828",
                          maxWidth: "60%",
                          boxShadow: "0 1px 2px rgba(255,255,255,0.2)",
                          wordWrap: "break-word",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "#ffffff" }}>
                          {msg.content}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })
              ) : (
                <Typography sx={{ color: "#ffffff" }}>No messages yet</Typography>
              )}
              <div ref={messagesEndRef} />
            </Paper>

            {sendError && (
              <Typography color="error" sx={{ mb: 2 }}>
                Error: {sendError.message}
              </Typography>
            )}

            {/* Message Input Box */}
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sendLoading}
                sx={{
                  borderRadius: "6px",
                  bgcolor: "#1E1E1E",
                  input: { color: "#ffffff" },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#000000",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#333333" },
                  borderRadius: "6px",
                  px: 3,
                }}
                onClick={handleSendMessage}
                disabled={sendLoading}
              >
                {sendLoading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Send"}
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "18px",
              color: "#bbbbbb",
              mt: 10,
            }}
          >
            Select a user to start chatting
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
