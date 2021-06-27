import cx from 'classnames';
import GlobalsContext from 'contexts/GlobalsContext';
import { META } from 'lib/constants';
import formatMenu from 'lib/formatMenu';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { RiMenuFill, RiCloseFill } from 'react-icons/ri';
import styles from './Header.module.scss';

export default function Header() {
  const globals = useContext(GlobalsContext);
  const [navOpen, setNavOpen] = useState(false);

  function handleHamburgerClick(event) {
    setNavOpen(!navOpen);
  }

  function handleClose(event) {
    setNavOpen(false);
  }

  let headerNav = [];

  if (Array.isArray(globals?.menuHeader?.nodes)) {
    headerNav = formatMenu(globals.menuHeader.nodes);
  }

  let hideNav = globals?.pageOptions?.headerHideNav || false;

  function MobileNav() {
    return (
      <div
        className={cx([
          styles.mobileNav,
          {
            // invisible: !navOpen,
            // [styles.isHidden]: !navOpen,
            // visible: navOpen,
            [styles.isVisible]: navOpen,
          },
        ])}
      >
        <a className={styles.close} onClick={handleClose}>
          <RiCloseFill />
        </a>
        <div className={styles.mobileNavInner}>
          <div className="container">
            <div className="row">
              <div className="col-12 text-center text-white">
                {headerNav.length > 0 && (
                  <ul className="list-unstyled">
                    {headerNav.map((item, i) => (
                      <li key={i}>
                        <Link href={item.path} prefetch={false}>
                          <a
                            className={cx(['text-nowrap'])}
                            onClick={handleClose}
                          >
                            {item.label}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DesktopNav() {
    return (
      <ul className={cx([styles.nav, 'list-inline'])}>
        {headerNav.map((item, i) => (
          <li className="list-inline-item" key={i}>
            <a href={item.path}>{item.label}</a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col">
            {META.siteName && (
              <div className={styles.logo}>
                <Link href="/" passHref>
                  {META.siteName}
                </Link>
              </div>
            )}
          </div>
          <div className="col-3 col-sm-1 col-lg-auto text-end">
            {!hideNav && headerNav.length > 0 && (
              <>
                <div
                  className={cx([
                    'd-lg-none text-end align-self-center',
                    styles.hamburger,
                  ])}
                >
                  <a onClick={handleHamburgerClick}>
                    <RiMenuFill />
                  </a>
                </div>
                <div className={cx(['d-none d-lg-block'])}>
                  <DesktopNav />
                </div>
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
