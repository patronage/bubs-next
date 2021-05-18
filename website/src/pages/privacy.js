import LayoutDefault from 'components/layouts/LayoutDefault';
import { getGlobalProps } from 'lib/wordpress';

import { GlobalsProvider } from '../contexts/GlobalsContext';

export default function main({ globals }) {
  return (
    <GlobalsProvider globals={globals}>
      <LayoutDefault title="Privacy Policy">
        <div className="section-padded">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1>Privacy Policy</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Ut sed lobortis justo. Mauris condimentum
                  lacus lectus, a vehicula odio vehicula eget. Sed
                  fringilla ex ut posuere fringilla. Proin dolor
                  velit, volutpat in dignissim sit amet, feugiat sed
                  sapien. Nulla facilisi.
                </p>
                <p>
                  Nam quis arcu et metus tristique tempor luctus ac
                  erat. Pellentesque at eros at ipsum placerat
                  commodo. Mauris sit amet magna dui. Maecenas lacinia
                  eros tincidunt nibh congue condimentum ac ut mauris.
                  Sed scelerisque dignissim mi, quis imperdiet libero
                  auctor sit amet. Nam accumsan odio at eros iaculis
                  bibendum a eu erat. Nullam ut leo tincidunt,
                  convallis massa at, placerat ipsum. Sed hendrerit
                  fringilla enim id sagittis. Cras dictum turpis sed
                  mauris egestas dapibus vel lobortis ante.
                </p>
                <p>
                  Sed vulputate bibendum lorem. Curabitur sed ultrices
                  leo. Nulla et nisl non ligula sodales facilisis.
                  Nunc magna ipsum, gravida aliquet velit eu, mattis
                  efficitur justo. Duis eget euismod dui, at convallis
                  lacus. Duis posuere ullamcorper orci vel pulvinar.
                  Praesent at pretium magna, sit amet ultricies mi.
                  Curabitur nec ex neque. Nam volutpat dolor neque,
                  aliquet accumsan arcu tincidunt ut. Pellentesque
                  habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </LayoutDefault>
    </GlobalsProvider>
  );
}

export async function getStaticProps() {
  const globals = await getGlobalProps();

  return {
    props: {
      globals,
    },
  };
}
