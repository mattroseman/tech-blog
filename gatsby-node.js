exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const BlogTemplate = require.resolve('./src/templates/blog-template.js');

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] },
        filter: { frontmatter: { type: { eq: "blog" } } },
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: '/blog/' + node.frontmatter.slug,
      component: BlogTemplate,
      context: {
        slug: node.frontmatter.slug
      },
    });
  });
};
