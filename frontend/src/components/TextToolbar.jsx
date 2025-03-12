import React from "react";
import { RichUtils } from "draft-js";

const TextToolbar = ({ editorState, setEditorState }) => {
  // Handle inline text formatting
  const applyStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <div className="toolbar">
      <button onClick={() => applyStyle("BOLD")}>B</button>
      <button onClick={() => applyStyle("ITALIC")}>I</button>
      <button onClick={() => applyStyle("UNDERLINE")}>U</button>
    </div>
  );
};

export default TextToolbar;
