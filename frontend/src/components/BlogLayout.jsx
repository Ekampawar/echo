import React from 'react';
import '../styles/BlogLayout.css';

const BlogLayout = ({ children, sidebarContent, title }) => {
  return (
    <div className="blog-layout">
      <main className="blog-main">
        {children}
      </main>

      <aside className="blog-sidebar">
        {sidebarContent} {/* Sidebar content dynamically passed */}
      </aside>
    </div>
  );
};

export default BlogLayout;
