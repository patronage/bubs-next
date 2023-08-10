import cx from 'classnames';
import GlobalsContext from 'contexts/GlobalsContext';
import formatMenu from 'lib/formatMenu';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { RiMenuFill, RiCloseFill } from 'react-icons/ri';
import styles from './Header.module.scss';

export default function Header() {
  const globals = useContext(GlobalsContext);
  const THEME = globals.THEME;
  const [navOpen, setNavOpen] = useState(false);

  function handleHamburgerClick() {
    setNavOpen(!navOpen);
  }

  function handleClose() {
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
                        <Link
                          href={item.path}
                          prefetch={false}
                          className={cx([
                            item.cssClasses,
                            item.cssClasses?.map((className) => {
                              return styles[className];
                            }),
                          ])}
                          onClick={handleClose}
                        >
                          {item.label}
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
            <Link
              className={cx([
                item.cssClasses,
                item.cssClasses?.map((className) => {
                  return styles[className];
                }),
              ])}
              href={item.path}
              prefetch={false}
            >
              {item.label}
            </Link>
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
            {THEME.meta.siteName && (
              <div className={styles.logo}>
                <Link href="/" prefetch={false}>
                  {THEME.meta.siteName}
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
