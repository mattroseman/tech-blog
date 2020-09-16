import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import './bio.scss';


function Bio() {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          bio
          skills
          blog_description
        }
      }
    }
  `);

  return (
    <div id='bio'>
      <div id='bio__description'>
        {data.site.siteMetadata.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <hr/>

      <h3>Skills</h3>

      <ul id='bio__skills'>
        {data.site.siteMetadata.skills.map((skill) => (
          <li className='bio__skill' key={skill}>
            <h5>{skill}</h5>
          </li>
        ))}
      </ul>

      <hr/>

      <h3>Blog</h3>

      <div id='bio__blog-description'>
        {data.site.siteMetadata.blog_description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default Bio;
