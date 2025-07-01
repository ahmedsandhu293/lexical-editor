
import {  useState } from "react";
import { RichTextEditor } from "./RichTextEditor";

export default function Form() {
  const [value, setValue] = useState("");

  return (
    <div className="p-2">
      <RichTextEditor
        placeholder="Select Post"
        name="post"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
}
