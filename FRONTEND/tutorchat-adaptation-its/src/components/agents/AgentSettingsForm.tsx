import React, { useEffect, useState } from "react";
import {
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Container,
  Slider,
  TextField,
  InputAdornment,
  createTheme,
  ThemeProvider,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { ChatOutlined } from "@mui/icons-material";
import axios from "axios";
import { useCookies } from "react-cookie";

const defaultTheme = createTheme();

interface AgentSettingProps {
  agentSetting: AgentSetting;
  handleFormSubmit: Function;
}

export default function AgentSettingsForm({
  agentSetting,
  handleFormSubmit,
}: Readonly<AgentSettingProps>) {
  const [cookies, setCookie, removeCookie] = useCookies(["Authorization"]);
  const [model, setModel] = useState(agentSetting.model);
  const [modelTags, setModelTags] = useState<Array<string>>([]);
  const [contextDegree, setContextDegree] = useState(
    agentSetting.contextDegree
  );
  const [verbosity, setVerbosity] = useState(agentSetting.verbosity);
  const [answerPromptness, setAnswerPromptness] = useState(
    agentSetting.answerPromptness
  );
  const [systemPrompt, setSystemPrompt] = useState(agentSetting.systemPrompt);

  useEffect(function getModelTags() {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/models`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${cookies.Authorization}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        console.log(data);
        setModelTags(data);
      });
  }, []);

  function handleOnClickSubmitUpdate() {
    const agentSetting: AgentSetting = {
      model: model,
      contextDegree: contextDegree,
      verbosity: verbosity,
      answerPromptness: answerPromptness,
      systemPrompt: systemPrompt,
    };
    handleFormSubmit(agentSetting);
  }

  const contextMarks = [
    {
      value: 1,
      label: "Sin pistas",
    },
    {
      value: 2,
      label: "Algunas pistas",
    },
    {
      value: 3,
      label: "Resolución completa",
    },
  ];

  const verbosityMarks = [
    {
      value: 1,
      label: "Resolución",
    },
    {
      value: 2,
      label: "Estándar",
    },
    {
      value: 3,
      label: "Conversacional",
    },
  ];

  const answerPromptnessMarks = [
    {
      value: 1,
      label: "Lenta",
    },
    {
      value: 2,
      label: "Normal",
    },
    {
      value: 3,
      label: "Rápida",
    },
  ];

  const sliders = [
    {
      name: "Grado de Contextualización",
      value: contextDegree,
      color: "success",
      onChange: setContextDegree,
      marks: contextMarks,
    },
    {
      name: "Verbosidad",
      value: verbosity,
      color: "primary",
      onChange: setVerbosity,
      marks: verbosityMarks,
    },
    {
      name: "Rapidez de Respuesta",
      value: answerPromptness,
      color: "secondary",
      onChange: setAnswerPromptness,
      marks: answerPromptnessMarks,
    },
  ];

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            paddingTop: 4,
            paddingBottom: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          style={{ marginTop: "0px" }}
        >
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Modelo LLM</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // defaultValue={agentSetting.model}
                value={model}
                label="LLm Model"
                onChange={(event: SelectChangeEvent) =>
                  setModel(event.target.value)
                }
              >
                {modelTags.map((value) => {
                  return <MenuItem value={value}>{value}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {sliders.map((slider, index) => (
                <Grid item xs={12} key={index}>
                  <Typography component="h5" variant="h6">
                    {slider.name}
                  </Typography>
                  <Slider
                    aria-label={slider.name}
                    value={slider.value}
                    step={1}
                    color={slider.color}
                    marks={slider.marks}
                    min={1}
                    max={3}
                    onChange={(event, value) => slider.onChange(value)}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Typography component="h5" variant="h6">
                  Prompt Inicial
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={9}
                  value={systemPrompt}
                  onChange={(event) => setSystemPrompt(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {<ChatOutlined />}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleOnClickSubmitUpdate}
            sx={{ mt: 3, mb: 2 }}
          >
            Actualizar Ajustes del Agente
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
