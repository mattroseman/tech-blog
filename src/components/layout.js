import React from 'react';

import Header from './header.js';

import './global.scss';
import './layout.scss';

function Layout({ children }) {
  return (
    <div id='site-container'>
      <Header />

      <main>{children}</main>
      <footer id='footer'>
        <div id='color-palette'>
          <div id='color-palette__primary-color'></div>
          <div id='color-palette__secondary-color'></div>
          <div id='color-palette__accent-color'></div>
        </div>

        <span>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </span>
      </footer>
    </div>
  );
}

export default Layout;
