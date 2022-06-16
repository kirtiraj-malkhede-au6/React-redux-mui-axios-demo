import "./App.css";
import { Fragment } from "react";
import AllPost from "./pages/AllPost";
import EditPost from "./pages/EditPost";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<AllPost></AllPost>}></Route>
        <Route path="/:id" element={<EditPost />}></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
