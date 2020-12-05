import Image from 'next/image';
import styles from './FlexHero.module.scss';

const FlexHero = (props) => {
  return (
    <div className={styles.outer}>
      <h3>Hero</h3>

      {props.heroImage?.sourceUrl && (
        <div className={styles['hero-image']}>
          <Image
            src={props.heroImage.sourceUrl}
            width={props.heroImage.mediaDetails.width}
            height={props.heroImage.mediaDetails.height}
            priority={props.index === 0 || props.index === 1}
          />
        </div>
      )}
    </div>
  );
};

export default FlexHero;
