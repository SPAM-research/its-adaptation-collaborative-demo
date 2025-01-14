import "./App.css";
import GlobalAgentSettings from "./components/agents/GlobalAgentSettings";
import NotFound from "./exceptions/NotFound";
import NavigationBar from "./components/NavigationBar";
import SignIn from "./components/SignIn";
import { Route, Routes } from "react-router-dom";
import React from "react";

function App() {
  //   const isDevelopmentMode = process.env.REACT_APP_ENV === "development";
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/hints" element={<SignIn />} />
      {/* {isDevelopmentMode && <Route path="/" element={<SignIn />} />} */}
      <Route path="/hints/home" element={<NavigationBar />}>
        <Route path="problems" element={<GlobalAgentSettings />} />
      </Route>
      <Route path="/hints/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
