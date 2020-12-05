import cx from 'classnames';
import styles from './FlexBlockquote.module.scss';

const FlexBlockquote = (props) => {
  return (
    <div className={cx([styles.outer, props.customClasses])}>
      <div className="container">
        {props.blockquote && (
          <h2 className={styles.quote}>{props.blockquote}</h2>
        )}
        {props.quoteAttribution && (
          <p className={styles.attribute}>
            &mdash; {props.quoteAttribution}
          </p>
        )}
      </div>
    </div>
  );
};

export default FlexBlockquote;
