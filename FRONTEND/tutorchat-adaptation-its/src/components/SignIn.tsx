import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios, { HttpStatusCode } from "axios";
import Grow from "@mui/material/Grow";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import { isJwtTokenExpired } from "../utils/isJwtTokenExpired";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
        Copyright © {new Date().getFullYear()} by the authors:
        <br />
        Pablo Arnau-González, Sergi Solera-Monforte, Yuyan Wu, Miguel Arevalillo-Herráez.
        <br />
        <i>"A Framework for Adapting Conversational Intelligent Tutoring Systems to Enable Collaborative Learning"</i>.
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "username",
  ]);
  const [isUserUnauthorized, setIsUserUnauthorized] = useState(false);
  const [isUnknownError, setIsUnknownError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user_data = new FormData(event.currentTarget);
    const username = user_data.get("username")?.toString().trim();
    if (username === "" || username === undefined ) {
      return;
    }
    setCookie("username", username.toString(), {
      path: "/",
      maxAge: 100800, // 1 week
      sameSite: "strict",
    });

    navigate("/hints/home/problems");

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://picsum.photos/seed/picsum/1920/1080)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Grow in>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <PersonIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                {isUserUnauthorized && (
                  <Alert severity="error">Invalid user or password.</Alert>
                )}
                {isUnknownError && (
                  <Alert severity="error">
                    Our system is currently not working as expected. Please, be
                    patient.
                  </Alert>
                )}
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grow>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
