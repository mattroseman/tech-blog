import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import './profile-image.scss';

function ProfileImage() {
  const data = useStaticQuery(graphql`
    query ProfileImageQuery {
      profileImage: file(relativePath: { eq: "profile.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return <Img fluid={data.profileImage.childImageSharp.fluid} className='profile-image'/>;
}

export default ProfileImage
