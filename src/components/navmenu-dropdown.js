import React from 'react';
import { Link } from 'gatsby';

import './navmenu-dropdown.scss';

const NavmenuDropdownWrapper = React.forwardRef(
  function NavmenuDropdown(props, ref) {
    return (
      <div id='nav-menu-dropdown' ref={ref} style={{display: props.show ? 'flex' : 'none'}}>
        <Link className='nav-menu-dropdown__item h4' to='/'>
          About
        </Link>

        <Link className='nav-menu-dropdown__item h4' to='/blog'>
          Blog
        </Link>

        <Link className='nav-menu-dropdown__item h4' to='/portfolio'>
          Portfolio
        </Link>

        <Link className='nav-menu-dropdown__item h4' to='/resume'>
          Resume
        </Link>
      </div>
    );
  }
);

export default NavmenuDropdownWrapper
