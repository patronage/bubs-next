import cx from 'classnames';
import slugify from 'slugify';
import FlexBlockquote from './FlexBlockquote';
import FlexHero from './FlexHero';
import FlexWysiwyg from './FlexWysiwyg';

const Flex = ({ sections }) => {
  const renderedSections = [];

  for (let i = 0; i < sections.length; i++) {
    let component, componentName;
    let paddingBottom = true;
    let paddingTop = true;
    const section = sections[i];
    const nextSection = sections[i + 1];

    // collapse padding if two sections in a row have the same color
    if (
      nextSection &&
      nextSection.backgroundColor === section.backgroundColor
    ) {
      paddingBottom = false;
    }

    // for known dark bg's, we'll add white text
    let backgroundDark = false;
    const darkArr = ['primary', 'black', 'dark'];
    if (darkArr.includes(section.backgroundColor)) {
      backgroundDark = true;
    }

    // Pass the flex index to the section so we can prioritize
    // image loading for first sections, etc.
    section.index === i;

    // look for any passed in classes, pass along to child
    section.customClasses = section.sectionClasses?.split(' ');

    // uncomment if you need to debug graphql, but don't commit
    // console.log(section);

    if (section.fieldGroupName.includes('Blockquote')) {
      componentName = 'blockquote';
      component = <FlexBlockquote {...section} />;
    } else if (section.fieldGroupName.includes('WysiwygContent')) {
      componentName = 'wysiwyg';
      component = <FlexWysiwyg {...section} />;
    } else if (section.fieldGroupName.includes('Hero')) {
      componentName = 'hero';
      component = <FlexHero {...section} />;
      paddingTop = false;
      paddingBottom = false;
    }

    const classNames = cx({
      [`flex-${componentName}`]: true,
      ['text-white']: backgroundDark,
      'section-padded': paddingTop || paddingBottom,
      ['pt-0']: !paddingTop,
      ['pb-0']: !paddingBottom,
      [`bg-${section.backgroundColor}`]: true,
    });

    // add slug ID if passed in
    let slug = '';
    if (section.sectionSlug) {
      slug = slugify(section.sectionSlug, { lower: true });
    }

    renderedSections.push(
      <section key={i} className={classNames} id={slug}>
        {component}
      </section>,
    );
  }

  return <>{renderedSections}</>;
};

export default Flex;
