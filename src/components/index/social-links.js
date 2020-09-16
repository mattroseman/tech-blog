import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import EmailIcon from '../../assets/icons/email.svg';
import GithubIcon from '../../assets/icons/github.svg';
import LinkedInIcon from '../../assets/icons/linkedin.svg';
import TwitterIcon from '../../assets/icons/twitter.svg';

import './social-links.scss';

function SocialLinks() {
  const data = useStaticQuery(graphql`
    query SocialLinksQuery {
      site {
        siteMetadata {
          email
          twitter
          linkedin
          github
        }
      }
    }
  `);

  return (
      <div id='social-links-container'>
        <a className='social-link' href={`mailto: ${data.site.siteMetadata.email}`} rel='noreferrer' target='_blank'>
          <EmailIcon/>
        </a>

        <a className='social-link' href={data.site.siteMetadata.github} rel='noreferrer' target='_blank'>
          <GithubIcon/>
        </a>

        <a className='social-link' href={data.site.siteMetadata.linkedin} rel='noreferrer' target='_blank'>
          <LinkedInIcon/>
        </a>

        <a className='social-link' href={data.site.siteMetadata.twitter} rel='noreferrer' target='_blank'>
          <TwitterIcon/>
        </a>
      </div>
  );
}

export default SocialLinks;
