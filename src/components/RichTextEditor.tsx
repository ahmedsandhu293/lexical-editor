import React, { useMemo, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolbarPlugin from "./Plugins/ToolbarPlugin";
import CustomOnChangePlugin from "./Plugins/CustomOnChangePlugin";
import PrintButton from "./PrintButton";

const theme = {
  text: {
    bold: "font-bold",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    italic: "italic",
    code:
      "text-black bg-gray-200 px-1 py-0.5 border border-gray-400 rounded font-mono dark:text-white dark:bg-gray-700 dark:border-gray-500",
  },
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ value, onChange, placeholder, name }) {
    const initialConfig = useMemo(
      () => ({
        namespace: name,
        theme,
        onError: () => {},
        nodes: [HeadingNode, CodeHighlightNode, CodeNode],
      }),
      [name]
    );

    const printRef = useRef<HTMLDivElement | null>(null);
    const [title, setTitle] = useState("");

    return (
      <div className="w-full">
        {/* Document Title Input */}
        <div className="mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Document Title"
            className="border px-3 py-1 rounded w-full text-lg font-semibold bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>

        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div
            ref={printRef}
            className="relative bg-white dark:bg-gray-900 border border-black dark:border-gray-700 rounded"
          >
            {/* Printed Title (hidden on screen but shown when printing) */}
            {title && (
              <h1 className="hidden print:block text-xl font-bold mb-2 dark:text-white">
                {title}
              </h1>
            )}

            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[120px] text-sm p-2 overflow-auto outline-none bg-white text-black dark:bg-gray-900 dark:text-white rounded" />
              }
              placeholder={
                <div className="absolute text-gray-400 dark:text-gray-500 top-2 left-2 text-sm pointer-events-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <AutoFocusPlugin />
          <HistoryPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
        </LexicalComposer>

        <div className="mt-4">
          <PrintButton targetRef={printRef} />
        </div>
      </div>
    );
  }
);
