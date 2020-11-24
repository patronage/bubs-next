import cx from "classnames";
import slugify from "slugify";
import FlexHero from "./FlexHero";
import FlexWysiwyg from "./FlexWysiwyg";
import FlexCarousel from "./FlexCarousel";
import FlexBlockquote from "./FlexBlockquote";

import styles from "./Flex.module.scss";

const Flex = ({ sections }) => {
  const renderedSections = [];

  for (let i = 0; i < sections.length; i++) {
    let component, componentName;
    let paddingBottom = true;
    let paddingTop = true;
    let darkBG = false;
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
    const darkArr = ["primary", "black", "dark"];
    if (darkArr.includes(section.backgroundColor)) {
      backgroundDark = true;
    }

    // Pass the flex index to the section so we can prioritize
    // image loading for first sections, etc.
    section.index === i;

    if (section.fieldGroupName.includes("Blockquote")) {
      componentName = "blockquote";
      component = <FlexBlockquote {...section} />;
    } else if (section.fieldGroupName.includes("WysiwygContent")) {
      componentName = "wysiwyg";
      component = <FlexWysiwyg {...section} />;
    } else if (section.fieldGroupName.includes("Hero")) {
      componentName = "hero";
      component = <FlexHero {...section} />;
      paddingTop = false;
      paddingBottom = false;
    } else if (section.fieldGroupName.includes("StatsCarousel")) {
      componentName = "carousel";
      component = <FlexCarousel {...section} />;
    }

    const classNames = cx({
      [styles["flex-section"]]: true,
      [`flex-${componentName}`]: true,
      ["text-white"]: backgroundDark,
      ["pt-3"]: paddingTop,
      ["pb-3"]: paddingBottom,
      [`bg-${section.backgroundColor}`]: true,
    });

    let slug = "";
    if (section.sectionSlug) {
      slug = slugify(section.sectionSlug, { lower: true });
    }

    renderedSections.push(
      <section key={i} className={classNames} id={slug}>
        {component}
      </section>
    );
  }

  return <>{renderedSections}</>;
};

export default Flex;
