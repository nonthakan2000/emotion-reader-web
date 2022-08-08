import { useAuth } from "./firebase";
import { Route, Switch, useHistory } from "react-router-dom";
import { database, logOut } from "./firebase";
import { ref, child, get } from "firebase/database";

// components
import Page404 from "./components/Page404";
import Login from "./components/Login";
import Overview from "./components/Overview";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import Admin from "./components/Admin";
import Content from "./components/Content";
import Exam from "./components/Exam";
import Manual from "./components/Manual";
import About from "./components/About";
import { useEffect, useState } from "react";
import AddAdmin from "./components/AddAdmin";
import Navigation from "./components/Navigation";
import LoadindPage from "./components/LoadindPage";
import History from "./components/History";
import Swal from "sweetalert2";

// css
import "./css/Navigation.css";

function App() {
  const currentAuth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  // check Admin
  function checkAdmin(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `Admin/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.status) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            logOut();
            Swal.fire({
              title: "คุณไม่ใช่แอดมิน",
              icon: "warning",
              confirmButtonText: "ตกลง",
            });
            history.push("/");
          }
        } else {
          setIsAdmin(false);
          logOut();
          history.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (!!currentAuth) {
      setIsAdmin(true);
      checkAdmin(currentAuth?.uid);
      setLoading(false);
    } else {
      setIsAdmin(false);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [currentAuth]);
  if (loading) {
    return <LoadindPage />;
  } else if (!!currentAuth) {
    if (!isAdmin) {
      return <LoadindPage />;
    }
    return (
      <>
        <Navigation />
        <Switch>
          <Route path="/" exact component={Overview} />
          <Route path="/overview" exact component={Overview} />
          <Route
            path="/profile"
            exact
            component={() => <Profile currentAuth={currentAuth} />}
          />
          <Route
            path="/profile/edit"
            exact
            component={() => <EditProfile currentAuth={currentAuth} />}
          />
          <Route
            path="/profile/changepassword"
            exact
            component={() => <ChangePassword currentAuth={currentAuth} />}
          />
          <Route
            path="/admin"
            exact
            component={() => <Admin currentAuth={currentAuth} />}
          />
          <Route path="/content" exact component={Content} />
          <Route path="/exam" exact component={Exam} />
          <Route path="/manual" exact component={Manual} />
          <Route path="/about" exact component={About} />
          <Route
            path="/addadmin/:key"
            exact
            component={() => <AddAdmin currentAuth={currentAuth} />}
          />
          <Route path="/history" component={History} />
          <Route path="*" component={Page404} />
        </Switch>
      </>
    );
  } else {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/addadmin/:key" exact component={AddAdmin} />
        <Route path="*" component={Page404} />
      </Switch>
    );
  }
}

export default App;
