import cx from 'classnames';
import GlobalsContext from 'contexts/GlobalsContext';
import _get from 'lodash/get';
import Link from 'next/link';
import { useContext } from 'react';
import styles from './Footer.module.scss';

export default function Footer() {
  const globals = useContext(GlobalsContext);
  const menus = _get(globals, 'menus.nodes[0].menuItems.nodes', []);

  return (
    <footer
      className={cx(
        'section-padded bg-dark text-white',
        styles.footer,
      )}
    >
      <div className="container">
        <div className={cx('row', styles.nav)}>
          <div className="col">
            <ul className="list-inline mb-0">
              {menus.map((item, i) => (
                <li className="list-inline-item" key={i}>
                  <a href={item.path}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <small>&copy; copyright {new Date().getFullYear()}</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
