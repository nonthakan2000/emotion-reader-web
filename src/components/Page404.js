import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Page404.css";
function Page404() {
  useEffect(() => {
    try {
      document.getElementById("navigatione-sidebar").classList.add("show-none");
    } catch (error) {}
  }, []);
  return (
    <>
      <div id="page404-container">
        <h1>
          4
          <span className="icon-error">
            <img src="/img/sad-page404.png" alt="" />
          </span>
          4
        </h1>
        <h2>Opps! Page not found.</h2>
        <Link to="/" className="returnhome-button">
          Return home
        </Link>
      </div>
    </>
  );
}

export default Page404;
