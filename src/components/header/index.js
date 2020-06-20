import styles from "./Header.module.scss";

export default () => (
  <header>
    <div className="container">
      <div className="row ">
        <div className="col mb-5">
          <div className={styles.borderBottom}>
            <h1>Site Title</h1>
          </div>
        </div>
      </div>
    </div>
  </header>
);
