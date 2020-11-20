import cx from 'classnames';
import FlexHero from '../flex-hero';
import FlexWysiwyg from '../flex-wysiwyg';
import FlexCarousel from '../flex-carousel';
import FlexBlockquote from '../flex-blockquote';

import styles from './flex.module.scss';

const Flex = ({ sections }) => {
  const renderedSections = [];

  for ( let i = 0; i < sections.length; i++ ) {
    let component, componentName;
    let paddingBottom = true;
    const section = sections[i];
    const nextSection = sections[i + 1];

    if ( nextSection && ( nextSection.backgroundColor === section.backgroundColor ) ) {
      paddingBottom = false;
    }
    
    if ( typeof section.blockquote !== 'undefined' ) {
      componentName = 'blockquote';
      component = <FlexBlockquote />
    } else if ( typeof section.wysiwygContent !== 'undefined' ) {
      componentName = 'wysiwyg';
      component = <FlexWysiwyg />
    } else if ( typeof section.heroHeading !== 'undefined' ) {
      componentName = 'hero';
      component = <FlexHero />
    } else if ( typeof section.statsCarousel !== 'undefined' ) {
      componentName = 'carousel';
      component = <FlexCarousel  />
    }

    const classNames = cx({
      [styles['flex-section']]: true,
      [`flex-${componentName}`]: true,
      [styles['flex-padding-top']]: true,
      [styles['flex-padding-bottom']]: paddingBottom,
      [styles[`background-${section.backgroundColor}`]]: true
    })

    renderedSections.push(<section key={i} className={classNames}>{component}</section>);    
  }

  return (
    <>{renderedSections}</>
  );
}

export default Flex;