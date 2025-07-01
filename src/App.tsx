import React, { useState, useEffect } from "react";

import { HeadingNode } from "@lexical/rich-text";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import "./App.css";
import { ListNode, ListItemNode } from '@lexical/list';
import Form from "./components/Form";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const editorConfig = {
    namespace: "LexicalEditor",
    theme: {
      heading: {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-semibold",
        h3: "text-xl font-medium",
      },
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        code: "bg-gray-200 px-1 py-0.5 rounded font-mono",
      },
    },
    onError(error: Error) {
      console.error("Lexical error:", error);
    },
    nodes: [HeadingNode, CodeNode, CodeHighlightNode,  ListNode,
      ListItemNode,],
  };



  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
         
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>

        <Form />
      </div>
    </div>
  );
}

export default App;