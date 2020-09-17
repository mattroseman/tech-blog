import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout.js';

import './blog-template.scss';


export const query = graphql`
 query($slug: String!) {
  markdownRemark(frontmatter: { slug: { eq: $slug } }) {
    frontmatter {
      date(formatString: "MMMM DD, YYYY")
      slug
      title
    }
    html
  }
 }
`;

function BlogTemplate({ data}) {
  const { markdownRemark: {frontmatter, html} } = data;

  return (
    <Layout>
      <div id='blog-post'>
        <h1>{frontmatter.title}</h1>

        <h2>{frontmatter.date}</h2>

        <div id='blog-post__content' dangerouslySetInnerHTML={{ __html: html }}></div>
      </div>
    </Layout>
  );
}


export default BlogTemplate;
