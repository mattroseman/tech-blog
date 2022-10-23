import React from 'react';

import Layout from '../components/layout.js';
import SEO from '../components/seo.js';

import Resume from '../components/resume/resume.js';

export default function ResumePage() {
  return (
    <Layout>
      <SEO title='Resume' />

      <Resume />
    </Layout>
  );
}
