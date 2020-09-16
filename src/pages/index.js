import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/layout.js';
import SEO from '../components/seo.js';
import ProfileImage from '../components/index/profile-image.js';
import Bio from '../components/index/bio.js';
import SocialLinks from '../components/index/social-links.js';


function IndexPage() {
  const data = useStaticQuery(graphql`
    query IndexQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title='Home' />

      <ProfileImage />

      <SocialLinks />

      <h1 id='site-title'>{data.site.siteMetadata.title}</h1>

      <Bio />
    </Layout>
  );
}

export default IndexPage;
