import React, { useState } from 'react';
import { RichUtils } from 'draft-js';
import "../styles/TextToolbar.css";

const TextToolbar = ({ editorState, setEditorState }) => {
  // Handle inline text formatting (Bold, Italic, Underline)
  const applyStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Handle font size changes
  const [fontSize, setFontSize] = useState('16px');

  const applyFontSize = (size) => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const currentStyle = editorState.getCurrentInlineStyle();
      const newStyle = currentStyle.add(`FONT_SIZE_${size}`);
      const newEditorState = RichUtils.toggleInlineStyle(editorState, newStyle);
      setEditorState(newEditorState);
    }
  };

  const handleFontSizeChange = (event) => {
    const size = event.target.value;
    setFontSize(size);
    applyFontSize(size); // Apply font size to selected text
  };

   // Handle bullet points
   const applyBulletList = () => {
    const currentStyle = editorState.getCurrentInlineStyle();
    if (currentStyle.has("BULLET_LIST")) {
      setEditorState(RichUtils.toggleBlockType(editorState, "unstyled"));
    } else {
      setEditorState(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
    }
  };

  return (
    <div className="toolbar">
      {/* Text formatting options */}
      <button onClick={() => applyStyle("BOLD")}>B</button>
      <button onClick={() => applyStyle("ITALIC")}>I</button>
      <button onClick={() => applyStyle("UNDERLINE")}>U</button>
      <button onClick={applyBulletList}>•</button>

      {/* Font size option */}
      <select onChange={handleFontSizeChange} value={fontSize}>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
      </select>
    </div>
  );
};

export default TextToolbar;
