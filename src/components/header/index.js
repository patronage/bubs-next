import Link from "next/link";
import styles from "./header.module.scss";

export default function Footer() {
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
