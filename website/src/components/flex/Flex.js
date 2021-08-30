import cx from 'classnames';
import React from 'react';
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
    let nextSection = sections[i + 1];

    // if current section is set to hidden, break and go to next
    if (section.hideSection === true) {
      continue;
    }

    // make sure nextSection isn't hidden. If it is, since it won't be rendered, we need to
    // jump ahead until we find a viewable section and compare with that.
    if (nextSection && nextSection.hideSection === true) {
      let j = 1;
      while (
        nextSection?.hideSection === true &&
        j <= sections.length
      ) {
        nextSection = sections[i + j];
        j++;
      }
    }

    // certain sections we want no padding, we just want the el (e.g. a full width image)
    let noPaddingSections = ['page_Acfflex_FlexContent_Hero'];

    if (noPaddingSections.includes(section.fieldGroupName)) {
      paddingTop = false;
      paddingBottom = false;
    }

    // collapse padding if two sections in a row have the same color, unless it's a noPaddingSection
    if (
      nextSection &&
      nextSection.backgroundColor === section.backgroundColor &&
      !noPaddingSections.includes(nextSection.fieldGroupName)
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
    section.index = i;

    // get ID if passed in
    let slug = '';
    if (section.sectionSlug) {
      slug = slugify(section.sectionSlug, { lower: true });
      section.slug = slug;
    }

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
    }

    const classNames = cx(
      {
        [`flex-${componentName}`]: true,
        ['text-white']: backgroundDark,
        'section-padded': paddingTop || paddingBottom,
        ['pt-0']: !paddingTop,
        ['pb-0']: !paddingBottom,
        [`bg-${section.backgroundColor}`]:
          section.backgroundColor != 'transparent',
      },
      section.customClasses,
    );

    // append classes and slug to component
    if (component) {
      let componentWithMoreProps = React.cloneElement(component, {
        classNames: classNames,
        id: slug,
        flexClass: `flex-${componentName}`,
      });

      renderedSections.push(
        <React.Fragment key={i}>
          {componentWithMoreProps}
        </React.Fragment>,
      );
    }
  }

  return <>{renderedSections}</>;
};

export default Flex;
