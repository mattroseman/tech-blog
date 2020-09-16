import { Link } from "gatsby"
import { useStaticQuery, graphql } from 'gatsby';
import React from "react"

import HamburgerIcon from '../assets/icons/hamburger.svg';

import './header.scss';

function Header() {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header id='header'>
      <div id='header__container'>
        <Link id='header__title' className='h3' to='/'>
          {data.site.siteMetadata.title}
        </Link>

        <div id='nav-menu'>
          {window.location.pathname !== '/' &&
          <Link className='nav-menu__item h4' to='/'>
            About
          </Link>
          }

          {window.location.pathname !== '/blog' &&
          <Link className='nav-menu__item h4' to='/blog'>
            Blog
          </Link>
          }

          {window.location.pathname !== '/portfolio' &&
          <Link className='nav-menu__item h4' to='/portfolio'>
            Portfolio
          </Link>
          }

          <a className='nav-menu__item h4' href='/resume.pdf' rel='noreferrer' target='_blank'>
            Resume
          </a>
        </div>

        <div id='nav-menu-button'>
          <HamburgerIcon />
        </div>
      </div>
    </header>
  );
}

export default Header
