module.exports = {
  siteMetadata: {
    author: `Matthew Roseman`,
    title: `Matt Roseman's Blog`,
    description: `A portfolio and blog site for Matthew Roseman`,
    bio: `I am a software developer working with Python and JavaScript. I've worked across frontend and backend of web development. The main languages I use or write about are Python, JavaScript, or Go.`,
    blog_description: `The blog contains posts either describing an algorithm or concept I found interesting, or tutorials solving problems I've faced. Most of the tutorial posts will also contain a repository I set up on github with the code from the post.`,
    skills: [
      `Python`, `JavaScript`, `SQL`, `Node.js`, `React`, `MongoDB`, `Docker`, `Google Cloud Platform`
    ],
    email: `mroseman95@gmail.com`,
    twitter: `https://twitter.com/MattRoseman`,
    linkedin: `https://www.linkedin.com/in/matthew-roseman-63414010b/`,
    github: `https://github.com/mattroseman`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-react-svg`,
      options: {
        rule: {
          include: `${__dirname}/src/assets/icons`
        }
      }
    }
  ],
}
