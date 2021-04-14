import cx from 'classnames';
import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
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
              <li className="list-inline-item">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link href="/posts">
                  <a>Posts</a>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link href="/flex-demo">
                  <a>Flex Demo</a>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link href="/privacy">
                  <a>Privacy Policy</a>
                </Link>
              </li>
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
