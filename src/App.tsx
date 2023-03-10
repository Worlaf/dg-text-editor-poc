import React from "react";
import "./App.css";
import { Editor } from "./components/Editor/Editor";

function App() {
  return (
    <div className="main">
      <div className="container">
        <div>
          <input type="text" placeholder="username" />
        </div>
        <div>
          <Editor className="editor" />
        </div>
      </div>
    </div>
  );
}

export default App;
