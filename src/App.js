import React from "react";
import { Route, Link } from "react-router-dom";
import Trace from "./Trace.js";

const App = () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      <Link to="/trace/7e5e10c6f69915c0">About</Link>
    </header>
    <Route path="/trace/:id" component={Trace} />
    <main />
  </div>
);

export default App;
