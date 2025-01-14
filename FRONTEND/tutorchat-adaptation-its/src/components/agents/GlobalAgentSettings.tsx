import { BarChart } from "@mui/x-charts/BarChart";
import AgentSettingsForm from "./AgentSettingsForm";
import { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import axios, { HttpStatusCode } from "axios";
import {
  Alert,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import Chat from "../chat/Chat";
import ProblemsList from "../ProblemsList";
import { LLMChatRoom } from "../../interfaces/LLMChatRoom";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";
import { ChatOutlined } from "@mui/icons-material";
import jspdf from "jspdf";
import autoTable from "jspdf-autotable";

const Header = ({ header }) => {
  return (
    <Paper
      square={false}
      elevation={2}
      style={{
        margin: "auto",
        textAlign: "center",
        height: "49px",
      }}
    >
      <Typography component="h1" variant="h4" gutterBottom>
        {header}
      </Typography>
    </Paper>
  );
};

export default function GlobalAgentSettings() {
  const [cookies] = useCookies(["username"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionStartedRef = useRef(false);
  const groupIdRef = useRef(-1)
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const problemIdQParam =
    searchParams.get("problemId") === null
      ? null
      : parseInt(searchParams.get("problemId")!); // condition required for typescript to ensure a non null value on `problemIdQParam`
  const [llmChatRoom, setLlmChatRoom] = useState<LLMChatRoom | undefined>(
    undefined
  );
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (problemIdQParam !== null)
  //     // ?problemId param has value
  //     handleOnClick(problemIdQParam);
  // }, [problemIdQParam]);

  function handleOnClick(problemId: number) {
    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/api/start/${cookies.username}/${problemId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        console.log(data.session_started)
        sessionStartedRef.current = data.session_started;
        console.log(groupIdRef.current)
        groupIdRef.current = data.group_id;
        setSearchParams({ problemId: `${problemId}` });
        console.log(data.messages)
        setLlmChatRoom({"problem": data.problem, "messages": data.messages});
      })
      .catch((error) => {
        console.log("ERROR")
      });
  }

  function handleClickNavigateBack(): void {
    setLlmChatRoom(undefined);
    navigate("/hints/home/problems");
  }

  function handleClickReset(): void {
    console.log(groupIdRef.current)
    setLlmChatRoom(undefined);
    axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/delete/${cookies.username}`).then(() => {
      navigate("/hints/home/problems");
    })
  }

  return (
    <Grid
      container
      spacing={2}
      style={{ padding: 20, minHeight: "100vh", justifyContent: "center" }}
    >
      {/* Central div - Chat */}
      <Grid item>
        <Paper elevation={2} style={{ padding: "20px" }}>
          <Typography component="h1" variant="h4" textAlign="center">
            🗨️ Chat LLM 💬
          </Typography>
          <hr />
          {/* <Header header="🗨️ LLM Testing Chat 💬" /> */}
          {llmChatRoom ? (
            <Chat
              llmChatRoom={llmChatRoom}
              handleClickNavigateBack={handleClickNavigateBack}
              handleClickReset={handleClickReset}
              sessionStarted={sessionStartedRef.current}
            />
          ) : (
            <ProblemsList handleOnClick={handleOnClick} />
          )}
        </Paper>
      </Grid>

      
    </Grid>
  );
}
