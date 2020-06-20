import LayoutDefault from "layouts/default.js";

function main() {
  return (
    <LayoutDefault title="Homepage">
      <div className="container">
        <div className="row">
          <div className="col">
            <h3>Home Page</h3>

            <br />

            <p>
              Create some folders in <code>pages/</code> to add more pages to
              your site
            </p>
          </div>
        </div>
      </div>
    </LayoutDefault>
  );
}

export default main;
