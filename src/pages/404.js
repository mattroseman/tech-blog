import React from 'react'

import Layout from '../components/layout.js'
import SEO from '../components/seo.js'

import NotFoundMessage from '../components/404/NotFoundMessage.js';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />

    <NotFoundMessage />
  </Layout>
)

export default NotFoundPage
