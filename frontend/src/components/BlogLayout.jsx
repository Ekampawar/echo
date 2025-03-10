import React, { useState } from 'react';
import '../styles/BlogLayout.css';

const BlogLayout = ({ children, title, onSubmit, buttonText }) => {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleTagsChange = (e) => {
    const input = e.target.value;
    const tagsArray = input.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setTags(tagsArray);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tags.length) {
      alert('Please add at least one tag.');
      return;
    }
    if (!image) {
      alert('Please upload an image.');
      return;
    }
    onSubmit(image, tags); // Pass image and tags to parent onSubmit
  };

  return (
    <div className="blog-container">
      <main className="blog-main">
        {children}
      </main>

      <aside className="blog-sidebar">
        <h2>{title}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image-upload">Upload Image</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags-input">Tags</label>
            <input
              id="tags-input"
              type="text"
              placeholder="Enter tags separated by commas"
              onChange={handleTagsChange}
            />
            <div className="tags-display">
              {tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button">
            {buttonText}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default BlogLayout;
