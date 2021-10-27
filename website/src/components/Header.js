import cx from 'classnames';
import GlobalsContext from 'contexts/GlobalsContext';
import { META } from 'lib/constants';
import formatMenu from 'lib/formatMenu';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
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
          'text-nowrap',
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
                      <li
                        className={cx([
                          'list-inline-item',
                          {
                            [styles.hasDropdown]:
                              item.children.length > 0,
                          },
                        ])}
                        key={i}
                      >
                        <Link href={item.path} prefetch={false}>
                          <a
                            className={cx([
                              'text-nowrap',
                              styles.parent,
                              item.cssClasses,
                              item.cssClasses?.map((className) => {
                                return styles[className];
                              }),
                            ])}
                            onClick={handleClose}
                            target={item.target}
                          >
                            {item.label}
                          </a>
                        </Link>
                        {item.children && item.children.length > 0 && (
                          <ul
                            className={cx([
                              styles.dropdown,
                              'list-unstyled',
                            ])}
                          >
                            {item.children.map((item, i) => (
                              <li key={i}>
                                <Link
                                  href={item.path}
                                  prefetch={false}
                                >
                                  <a
                                    className={cx([
                                      styles.child,
                                      item.cssClasses,
                                      item.cssClasses?.map(
                                        (className) => {
                                          return styles[className];
                                        },
                                      ),
                                    ])}
                                    target={item.target}
                                    onClick={handleClose}
                                  >
                                    {item.label}
                                  </a>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
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
      <ul className={cx([styles.desktopNav, 'list-inline'])}>
        {headerNav.map((item, i) => (
          <li
            className={cx([
              'list-inline-item',
              { [styles.hasDropdown]: item.children.length > 0 },
            ])}
            key={i}
          >
            <Link href={item.path}>
              <a
                className={cx(
                  styles.parent,
                  item.cssClasses,
                  item.cssClasses?.map((className) => {
                    return styles[className];
                  }),
                )}
                target={item.target}
              >
                {item.label}
                {item.children.length > 0 && (
                  <span className={styles.arrow}>
                    <FaChevronDown />
                  </span>
                )}
              </a>
            </Link>
            {item.children && item.children.length > 0 && (
              <ul className={cx([styles.dropdown, 'list-unstyled'])}>
                {item.children.map((item, i) => (
                  <li className="list-inline-item" key={i}>
                    <Link href={item.path}>
                      <a
                        className={styles.child}
                        target={item.target}
                      >
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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
                <Link href="/">
                  <a>{META.siteName}</a>
                  {/* <Image
                    src="/img/logo.svg"
                    width="200"
                    height="80"
                    alt={META.title}
                    className={styles.logo}
                  /> */}
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
