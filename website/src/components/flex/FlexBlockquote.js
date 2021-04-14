import cx from 'classnames';
import styles from './FlexBlockquote.module.scss';

const FlexBlockquote = (props) => {
  // map any custom classes to our SCSS module style object
  let moduleClassNames = props.customClasses?.map((className) => {
    return styles[className];
  });

  return (
    <section
      className={cx([
        props.classNames,
        moduleClassNames,
        styles[props.flexClass],
      ])}
      id={props.slug}
    >
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
    </section>
  );
};

export default FlexBlockquote;
