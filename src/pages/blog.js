import React from 'react';

import Layout from '../components/layout.js';
import SEO from '../components/seo.js';
import BlogPosts from '../components/blog/BlogPosts.js';


function BlogPage() {
  return (
    <Layout>
      <SEO title='Blog' />

      <h1>Blog Posts</h1>

      <BlogPosts />
    </Layout>
  );
}

export default BlogPage;
