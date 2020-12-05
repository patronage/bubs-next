import cx from 'classnames';
import PostBody from 'components/post/PostBody';
import styles from './FlexWysiwyg.module.scss';

const FlexWysiwyg = (props) => {
  return (
    <div className={cx([styles.outer, props.customClasses])}>
      <div className="container">
        {props.sectionHeading && <h2>{props.sectionHeading}</h2>}
        {props.wysiwygContent && (
          <PostBody content={props.wysiwygContent} />
        )}
      </div>
    </div>
  );
};

export default FlexWysiwyg;
