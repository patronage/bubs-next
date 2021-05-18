import GlobalsContext from 'contexts/GlobalsContext';
import _get from 'lodash/get';
import Link from 'next/link';
import { useContext } from 'react';
import styles from './Header.module.scss';

export default function Header() {
  const globals = useContext(GlobalsContext);
  const menus = _get(globals, 'menus.nodes[0].menuItems.nodes', []);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className="row ">
          <div className="col">
            <div className={styles.logo}>
              <Link href="/">
                <h1>Site Title</h1>
              </Link>
            </div>
          </div>
          <div className="col text-end">
            <ul className={`${styles.nav} list-inline"`}>
              {menus.map((item, i) => (
                <li className="list-inline-item" key={i}>
                  <a href={item.path}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
