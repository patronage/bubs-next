import Link from 'next/link';
import styles from './Header.module.scss';

export default function Header() {
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
        </div>
      </div>
    </header>
  );
}
