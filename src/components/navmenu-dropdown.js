import React from 'react';
import { Link } from 'gatsby';

import './navmenu-dropdown.scss';

const NavmenuDropdownWrapper = React.forwardRef(
  function NavmenuDropdown(props, ref) {
    return (
      <div id='nav-menu-dropdown' ref={ref} style={{display: props.show ? 'flex' : 'none'}}>
        {typeof window !== 'undefined' && window.location.pathname !== '/' &&
        <Link className='nav-menu-dropdown__item h4' to='/'>
          About
        </Link>
        }

        {typeof window !== 'undefined' && window.location.pathname !== '/blog' &&
        <Link className='nav-menu-dropdown__item h4' to='/blog'>
          Blog
        </Link>
        }

        {typeof window !== 'undefined' && window.location.pathname !== '/portfolio' &&
        <Link className='nav-menu-dropdown__item h4' to='/portfolio'>
          Portfolio
        </Link>
        }

        <a className='nav-menu-dropdown__item h4' href='/resume.pdf' rel='noreferrer' target='_blank'>
          Resume
        </a>
      </div>
    );
  }
);

export default NavmenuDropdownWrapper
