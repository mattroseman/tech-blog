import React from 'react';

import Layout from '../components/layout.js';
import SEO from '../components/seo.js';

import Portfolio from '../components/portfolio/portfolio.js';


function PortfolioPage() {
  return (
    <Layout>
      <SEO title='Portfolio' />

      <Portfolio />
    </Layout>
  );
}

export default PortfolioPage;
