import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  TextField,
  Typography,
  Zoom,
  Badge,
  Fab,
  Button,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { blue, green, pink } from "@mui/material/colors";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Face6Icon from "@mui/icons-material/Face6";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useCookies } from "react-cookie";
import styled from "@emotion/styled";
import "../../styles/Chat.css";
import { useTheme } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Circle, Delete, Face2Outlined, FaceRetouchingNaturalTwoTone } from "@mui/icons-material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px white`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const MessageBubble = ({ message , username}) => {
  const isSentByMe = message.username === username;
  const isSentByTutor = message.username == "system";
  console.log(isSentByTutor)
  let bgcolor = green[500]
  if (message.content != "SESSION STARTED") {
    return (
      <ListItem
        alignItems="flex-start"
        sx={{
          display: "flex",
          flexDirection: isSentByTutor ? "row" : "row-reverse",
          marginBottom: "10px",
        }}
      >
        <ListItemAvatar style={{ marginTop: "0px ", marginLeft: "10px" }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              alt={message.role}
              src=""
              sx={{ bgcolor: isSentByMe ? green[500] : isSentByTutor ? pink[500] : blue[500] }}
            >
              {isSentByMe ? <Face6Icon /> : isSentByTutor ? <SmartToyIcon /> : <Avatar/>}
            </Avatar>
          </StyledBadge>
        </ListItemAvatar>
        <Paper
          elevation={3}
          sx={{
            padding: "10px",
            maxWidth: "75%",
            backgroundColor: isSentByMe ? "#e0f7fa" : "#fff",
            borderRadius: "10px",
          }}
        >
          {/* <Typography variant="subtitle2" style={{ fontWeight: "bold" }}>
            {message.username === "system" ? "SYSTEM DIRECTIVE " : ""}
          </Typography> */}
          <Typography variant="body2">{message.content}</Typography>
        </Paper>
      </ListItem>
    );
  }

};

const WriteMessage = ({ handleOnChange, handleOnClick, message }) => {
  return (
    <div style={{ display: "flex" }}>
      <TextField
        fullWidth
        label="Tutor (Chat) Agents LLM"
        id="fullWidth"
        value={message}
        variant="outlined"
        color="secondary"
        onChange={handleOnChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MessageIcon />
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        aria-label="send"
        size="large"
        onClick={handleOnClick}
        color="secondary"
      >
        <SendIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
};

export default function ChatComponent({
  llmChatRoom,
  handleClickNavigateBack,
  sessionStarted,
  handleClickReset
}) {
  const [cookies] = useCookies(["username", "Authorization"]);
  const socketURL = `${import.meta.env.VITE_WS_BASE_URL}/api/chat/${
    cookies.username
  }/${llmChatRoom.problem.id}/ws`;
  console.log("xall")
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketURL, {share: false});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([...llmChatRoom.messages.slice(1)]);
  const [hasSessionStarted, setHasSessionStarted] = useState(sessionStarted);
  console.log("hasSessionStarted: ", hasSessionStarted)
  const messagesEndRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (lastMessage !== null) {
      setHasSessionStarted(true)
      const incomingMessage = JSON.parse(JSON.parse(lastMessage.data));
      console.log("incomingMessage", incomingMessage)
      if (incomingMessage.message.content == "CLOSE_SESSION") {
        getWebSocket()?.close();
        handleClickReset();
      } else {
        const { message: incomingChunk, done } = incomingMessage;

        setMessages((prevMessages) => {
          const lastMessage =
            prevMessages.length > 0
              ? prevMessages[prevMessages.length - 1]
              : null;
          if (!lastMessage || lastMessage.done) {
            return [...prevMessages, { ...incomingChunk, done }];
          } else {
            return [
              ...prevMessages.slice(0, -1),
              {
                ...lastMessage,
                content: lastMessage.content + incomingChunk.content,
                done,
              },
            ];
          }
        });
      }
    }
  }, [lastMessage]);

  useEffect(() => () => {
    console.log("close ws")
    getWebSocket()?.close() 
  },  []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "Open") scrollToBottom();
  }, [messages, connectionStatus]); // Every time a message chunk is received, it must scroll to bottom

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    setIsAtBottom(bottom);
  };

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleOnClickSendMessage = () => {
    if (message.trim().length === 0) return;
    sendMessage(message);
    setMessage("");
  };

  const handleKeyDownSendMessage = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      handleOnClickSendMessage();
    }
  };


  return (
    <div
      style={{ padding: theme.spacing(2) }}
      onKeyDown={handleKeyDownSendMessage}
    >
      {hasSessionStarted ? (
        <div>
          <Typography variant="subtitle2">
            {llmChatRoom.problem.statement}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              endIcon={<FastRewindIcon />}
              onClick={handleClickNavigateBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              endIcon={<Delete />}
              color="error"
              onClick={handleClickReset}
            >
              Reset
            </Button>
          </Stack>
          <List
            sx={{
              width: "100%", // Removed maxWidth to allow full width use
              bgcolor: "background.paper",
              overflow: "auto",
              height: 525, // Set a fixed height or make it responsive
              position: "relative",
            }}
            onScroll={handleScroll}
          >
            {messages.map((message, index) => (
              message.content !== "" ? <MessageBubble key={index} message={message} username={cookies.username} /> : " "
            ))}
            <div ref={messagesEndRef} />
          </List>
          <WriteMessage
            handleOnChange={handleOnChange}
            handleOnClick={handleOnClickSendMessage}
            message={message}
          />
          <Zoom
            in={!isAtBottom}
            timeout={theme.transitions.duration}
            style={{
              position: "fixed", // Use fixed if it must stay visible while scrolling
              bottom: "190px",
              right: "700px", // Align to bottom-right corner of the screen
            }}
            unmountOnExit
          >
            <Fab color="secondary" size="small" onClick={scrollToBottom}>
              <KeyboardDoubleArrowDownIcon />
            </Fab>
          </Zoom>
        </div>
      ) : (
        <LinearProgress color="primary" variant="query" />
      )}
    </div>
  );
}
