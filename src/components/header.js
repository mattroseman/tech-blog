import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import NavmenuDropdown from './navmenu-dropdown.js';

import HamburgerIcon from '../assets/icons/hamburger.svg';

import './header.scss';

function Header() {
  const [navmenuDropdownShowing, setNavmenuDropdownShowing] = useState(false);

  const navmenuDropdownElement = useRef(null);
  const navmenuButton = useRef(null);

  function handleClickOutsideNavmenuDropdown(event) {
    if (
      !navmenuDropdownElement.current.contains(event.target) &&
      !navmenuButton.current.contains(event.target) &&
      navmenuDropdownShowing
    ) {
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
          <Link className='nav-menu__item h4' to='/'>
            About
          </Link>
          <Link className='nav-menu__item h4' to='/blog'>
            Blog
          </Link>
          <Link className='nav-menu__item h4' to='/portfolio'>
            Portfolio
          </Link>
          <Link className='nav-menu__item h4' to='/resume'>
            Resume
          </Link>
        </div>

        <div id='nav-menu-button' ref={navmenuButton} onClick={() => setNavmenuDropdownShowing(true)}>
          <HamburgerIcon />
        </div>
      </div>

      <NavmenuDropdown ref={navmenuDropdownElement} show={navmenuDropdownShowing}/>
    </header>
  );
}

export default Header
