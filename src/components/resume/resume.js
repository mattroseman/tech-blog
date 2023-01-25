import React, { useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import PdfIcon from '../../assets/icons/pdf.svg';

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
    <div id='resume-container'>
      <div id='resume' dangerouslySetInnerHTML={{__html: data.allMarkdownRemark.edges[0].node.html}}>
      </div>
      <a id='resume-pdf-download' href='/resume.pdf' rel='noreferrer' target='_blank'>
        <PdfIcon />
        <div>PDF Download</div>
      </a>
    </div>
  );
}
