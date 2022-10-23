import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";

import './profile-image.scss';

function ProfileImage() {
  const data = useStaticQuery(graphql`query ProfileImageQuery {
  profileImage: file(relativePath: {eq: "profile.png"}) {
    childImageSharp {
      gatsbyImageData(width: 300, quality: 75, layout: CONSTRAINED)
    }
  }
}
`);

  return (
    <GatsbyImage
      image={data.profileImage.childImageSharp.gatsbyImageData}
      alt='Profile Image'
      className='profile-image' />
  );
}

export default ProfileImage
