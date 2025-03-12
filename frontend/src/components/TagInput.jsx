import React, { useState } from 'react';

const TagInput = ({ tags, setTags }) => {
  const [tagInput, setTagInput] = useState('');

  const handleKeyDown = (e) => {
    // Add tag when pressing 'Enter' or comma (',')
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault(); // Prevent page refresh on Enter
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tag-input-container">
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter tags (comma or Enter to add)"
      />
      <div className="tags-list">
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            <span>{tag}</span>
            <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
