import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import './BlogPosts.scss';


function BlogPosts() {
  const data = useStaticQuery(graphql`
    query BlogPostsQuery {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            frontmatter {
              slug
              title
              date(formatString: "MMMM DD, YYYY")
            }
          }
        }
      }
    }
  `);

  return (
    <div id='blog-posts'>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <a key={node.frontmatter.slug} className='blog-post' href={`/blog/${node.frontmatter.slug}`}>
          <h4 className='blog-post__title'>{node.frontmatter.title}</h4>
          <span className='blog-post__date'>{node.frontmatter.date}</span>
        </a>
      ))}
    </div>
  );
}

export default BlogPosts;
