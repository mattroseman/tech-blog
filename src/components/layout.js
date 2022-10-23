import React, { useEffect }  from 'react';

import Header from './header.js';

import './global.scss';
import './layout.scss';

function Layout({ children }) {
  useEffect(() => {
    const mainElement = document.getElementsByTagName('body')[0];
    if (window.location.pathname == '/resume') {
      mainElement.style.color = 'black';
      mainElement.style.backgroundColor = 'white';
    } else {
      mainElement.style.color = null;
      mainElement.style.backgroundColor = null;
    }
  });
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
