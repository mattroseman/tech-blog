import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import './portfolio.scss';

function Portfolio() {
  const data = useStaticQuery(graphql`
    query PortfolioQuery {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___startDate] },
        filter: { frontmatter: { type: { eq: "portfolio" }}},
        limit: 1000
      ) {
        edges {
          node {
            id
            html
            frontmatter {
              title
              startDate(formatString: "MMMM YYYY")
              endDate(formatString: "MMMM YYYY")
            }
          }
        }
      }
    }
  `);

  return (
    <div id='portfolio'>
      <h1>Portfolio</h1>

      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id} className='portfolio-item'>
          <hr/>

          <h2 className='portfolio-item__title'>{ node.frontmatter.title }</h2>

          <div className='portfolio-item__content' key={node.id} dangerouslySetInnerHTML={{ __html: node.html}}></div>
        </div>

      ))}
    </div>
  );
}

export default Portfolio;
