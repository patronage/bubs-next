import cx from 'classnames';
import Image from 'next/image';
import styles from './FlexHero.module.scss';

const FlexHero = (props) => {
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
      {props.heroImage?.sourceUrl && (
        <div className={styles['hero-image']}>
          <Image
            src={props.heroImage.sourceUrl}
            width={props.heroImage.mediaDetails.width}
            height={props.heroImage.mediaDetails.height}
            priority={props.index === 0 || props.index === 1}
            layout="responsive"
          />
        </div>
      )}
    </section>
  );
};

export default FlexHero;
