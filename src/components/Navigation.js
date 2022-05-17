import { useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { logOut } from "../firebase";
import { useAuth } from "../firebase";

function Navigation() {
  const currentAuth = useAuth();
  const history = useHistory();

  async function handleLogOut() {
    try {
      logOut();
      history.push("/");
    } catch (error) {
      alert(error);
    }
  }

  function toggleNav() {
    const sidebar = document.querySelector("nav");
    sidebar.classList.toggle("close");
    let toggleNow = sessionStorage.getItem("toggleNav");
    if (toggleNow === "close") {
      sessionStorage.setItem("toggleNav", "open");
    } else {
      sessionStorage.setItem("toggleNav", "close");
    }
  }
  useEffect(() => {
    let toggleNow = sessionStorage.getItem("toggleNav");
    if (toggleNow !== "close") {
      const sidebar = document.querySelector("nav");
      sidebar.classList.toggle("close");
    }
  }, []);

  return (
    <nav className="sidebar close" id="navigatione-sidebar">
      <header>
        <div className="image-text">
          <span className="image">
            <img
              src="https://cdn-icons-png.flaticon.com/512/725/725107.png"
              alt=""
            />
          </span>

          <div className="text logo-text">
            <span className="name">EmotionReader</span>
            <NavLink to="/profile" className="profession">
              {(currentAuth?.email)?.substring(0, 16)}
            </NavLink>
          </div>
        </div>
        <i className="bx bx-menu toggle" onClick={toggleNav}></i>
        <i className="bx bx-chevron-right toggle" onClick={toggleNav}></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <NavLink to="/overview" activeClassName="nav-active">
                <i className="bx bx-world icon"></i>
                <span className="text nav-text">ภาพรวมระบบ</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink to="/admin" activeClassName="nav-active">
                <i className="bx bx-support icon"></i>
                <span className="text nav-text">ผู้ดูแลระบบ</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink to="/content" activeClassName="nav-active">
                <i className="bx bx-book-content icon"></i>
                <span className="text nav-text">เนื้อหาการเรียนรู้</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink to="/exam" activeClassName="nav-active">
                <i className="bx bx-book-open icon"></i>
                <span className="text nav-text">ข้อสอบการรับรู้</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink to="/manual" activeClassName="nav-active">
                <i className="bx bx-book-bookmark icon"></i>
                <span className="text nav-text">แนะนำการใช้งาน</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink to="/about" activeClassName="nav-active">
                <i className="bx bx-info-circle icon"></i>
                <span className="text nav-text">เกี่ยวกับแอปพลิเคชัน</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/history" activeClassName="nav-active">
                <i className="bx bx-history icon"></i>
                <span className="text nav-text">ประวัติการใช้งาน</span>
              </NavLink>
            </li>

            <li className="" onClick={handleLogOut}>
              <NavLink to="#">
                <i className="bx bx-log-out icon"></i>
                <span className="text nav-text">ออกจากระบบ</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
          <li className="out-full" onClick={handleLogOut}>
            <NavLink to="#">
              <i className="bx bx-log-out icon"></i>
              <span className="text nav-text">ออกจากระบบ</span>
            </NavLink>
          </li>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
