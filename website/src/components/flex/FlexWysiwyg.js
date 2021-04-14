import cx from 'classnames';
import PostBody from 'components/post/PostBody';
import styles from './FlexWysiwyg.module.scss';

const FlexWysiwyg = (props) => {
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
        {props.sectionHeading && (
          <h2
            dangerouslySetInnerHTML={{ __html: props.sectionHeading }}
          ></h2>
        )}
        {props.wysiwygContent && (
          <PostBody content={props.wysiwygContent} />
        )}
      </div>
    </section>
  );
};

export default FlexWysiwyg;
