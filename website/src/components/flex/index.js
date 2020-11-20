import FlexHero from '../flex-hero';
import FlexWysiwyg from '../flex-wysiwyg';
import FlexCarousel from '../flex-carousel';
import FlexBlockquote from '../flex-blockquote';

const Flex = ({ sections }) => {
  const renderedSections = [];

  for ( let i = 0; i < sections.length; i++ ) {
    let component;
    const section = sections[i];
    const props = { key: i };
    
    if ( typeof section.blockquote !== 'undefined' ) {
      component = <FlexBlockquote key={i} />
    } else if ( typeof section.wysiwygContent !== 'undefined' ) {
      component = <FlexWysiwyg key={i} />
    } else if ( typeof section.heroHeading !== 'undefined' ) {
      component = <FlexHero key={i} />
    } else if ( typeof section.statsCarousel !== 'undefined' ) {
      component = <FlexCarousel key={i} />
    }

    renderedSections.push( component );    
  }

  return (
    <>{renderedSections}</>
  );
}

export default Flex;