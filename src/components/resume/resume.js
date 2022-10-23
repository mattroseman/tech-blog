import React, { useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import './resume.scss';

export default function Resume() {
  const data = useStaticQuery(graphql`
    query ResumeQuery {
      allMarkdownRemark(
        filter: { frontmatter: { type: { eq: "resume" }}},
        limit: 1
      ) {
        edges {
          node {
            html
            frontmatter {
              date(formatString: "MMMM YYYY")
            }
          }
        }
      }
    }
  `);

  return (
    <div id='resume' dangerouslySetInnerHTML={{__html: data.allMarkdownRemark.edges[0].node.html}}>
    </div>
  );
}
