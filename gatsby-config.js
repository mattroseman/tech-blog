module.exports = {
  siteMetadata: {
    author: `Matthew Roseman`,
    title: `Matt Roseman's Blog`,
    description: `A portfolio and blog site for Matthew Roseman`,
    bio: [
      `I am a software developer working with Python and JavaScript. I've worked across frontend and backend of web development. The main languages I use or write about are Python, JavaScript, or Go.`,
    ],
    blog_description: [
      `The blog contains posts either describing an algorithm or concept I found interesting, or tutorials solving problems I've faced. Most of the tutorial posts will also contain a repository I set up on github with the code from the post.`,
    ],
    skills: [
      `Python`, `JavaScript`, `SQL`, `Node.js`, `React`, `MongoDB`, `Django`, `Docker`, `Google Cloud Platform`
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
        icon: `src/assets/images/dog.png`, // This path is relative to the root of the site.
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
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `portfolio`,
        path: `${__dirname}/content/portfolio`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill="currentColor" fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              elements: [`h2`],
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              backgroundColor: 'white',
              maxWidth: 590,
              showCaptions: ['title']
            }
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: `language-`,
              inlineCodeMarker: `>`,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [],
              prompt: {
                user: `root`,
                host: `localhost`,
                global: false
              },
              escapeEntitites: {}
            }
          },
        ]
      }
    }

  ],
}
