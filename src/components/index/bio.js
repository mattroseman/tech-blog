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
      <p id='bio__description'>{data.site.siteMetadata.bio}</p>

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

      <p id='bio__blog-description'>
        {data.site.siteMetadata.blog_description}
      </p>
    </div>
  );
}

export default Bio;
