import cx from 'classnames';
import GlobalsContext from 'contexts/GlobalsContext';
import { META } from 'lib/constants';
import formatMenu from 'lib/formatMenu';
import Link from 'next/link';
import { useContext } from 'react';
import styles from './Header.module.scss';

export default function Header() {
  const globals = useContext(GlobalsContext);
  let headerNav = [];

  if (Array.isArray(globals?.menuHeader?.nodes)) {
    headerNav = formatMenu(globals.menuHeader.nodes);
  }

  let hideNav = globals?.pageOptions?.headerHideNav || false;

  return (
    <header className={styles.header}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col">
            {META.siteName && (
              <div className={styles.logo}>
                <Link href="/" passHref>
                  <h1>{META.siteName}</h1>
                </Link>
              </div>
            )}
          </div>
          <div className="col text-end">
            {!hideNav && headerNav.length > 0 && (
              <ul className={cx([styles.nav, 'list-inline'])}>
                {headerNav.map((item, i) => (
                  <li className="list-inline-item" key={i}>
                    <a href={item.path}>{item.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
