import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import NavmenuDropdown from './navmenu-dropdown.js';

import HamburgerIcon from '../assets/icons/hamburger.svg';

import './header.scss';

function Header() {
  const [navmenuDropdownShowing, setNavmenuDropdownShowing] = useState(false);

  const navmenuDropdownElement = useRef(null);

  function handleClickOutsideNavmenuDropdown(event) {
    if (!navmenuDropdownElement.current.contains(event.target) && navmenuDropdownShowing) {
      setNavmenuDropdownShowing(false);

      event.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideNavmenuDropdown);

    return () => {
      document.removeEventListener('click', handleClickOutsideNavmenuDropdown);
    }
  }, [navmenuDropdownShowing, navmenuDropdownElement]);


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
          {(typeof window === 'undefined' ||  window.location.pathname !== '/') &&
          <Link className='nav-menu__item h4' to='/'>
            About
          </Link>
          }

          {(typeof window === 'undefined' || window.location.pathname !== '/blog') &&
          <Link className='nav-menu__item h4' to='/blog'>
            Blog
          </Link>
          }

          {(typeof window == 'undefined' || window.location.pathname !== '/portfolio') &&
          <Link className='nav-menu__item h4' to='/portfolio'>
            Portfolio
          </Link>
          }

          <a className='nav-menu__item h4' href='/resume.pdf' rel='noreferrer' target='_blank'>
            Resume
          </a>
        </div>

        <div id='nav-menu-button' onClick={() => setNavmenuDropdownShowing(true)}>
          <HamburgerIcon />
        </div>
      </div>

      <NavmenuDropdown ref={navmenuDropdownElement} show={navmenuDropdownShowing}/>
    </header>
  );
}

export default Header
