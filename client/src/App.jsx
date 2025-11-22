import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateLinkPage from "./pages/Home";
import ListLinksPage from "./pages/Link";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateLinkPage />} />
          <Route path="/dashboard" element={<ListLinksPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
