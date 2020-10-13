import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout.js';
import SEO from '../components/seo.js';

import './blog-template.scss';
import 'katex/dist/katex.min.css';


export const query = graphql`
 query($slug: String!) {
  markdownRemark(frontmatter: { slug: { eq: $slug } }) {
    frontmatter {
      date(formatString: "MMMM DD, YYYY")
      slug
      title
      description
    }
    html
  }
 }
`;

function BlogTemplate({ data }) {
  let { markdownRemark: {frontmatter, html} } = data;
  html = html.replace(/<a href="http/g, '<a target="_blank" href="http');

  return (
    <Layout>
      <SEO title={frontmatter.title} description={frontmatter.description} />
      <div id='blog-post'>
        <h1>{frontmatter.title}</h1>

        <span id='blog-post__date'>{frontmatter.date}</span>

        <div id='blog-post__content' dangerouslySetInnerHTML={{ __html: html }}></div>
      </div>
    </Layout>
  );
}


export default BlogTemplate;
