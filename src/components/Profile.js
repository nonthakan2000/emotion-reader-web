
import "../css/Profile.css";
import { Link } from "react-router-dom";
import { database } from "../firebase";
import { ref as refDB, child, get } from "firebase/database";
import { useEffect, useState } from "react";

function Profile(props) {
  const { currentAuth } = props;
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    if (!!currentAuth) {
      const dbRef = refDB(database);
      get(child(dbRef, `Admin/${currentAuth?.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setAdminData(snapshot.val());
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [currentAuth]);

  return (
    <section className="container">
      <div className="text">ข้อมูลส่วนตัว</div>
      <div className="profile">
        <div className="btn-editprofile">
          <Link to="/profile/edit">
            <i className="bx bx-edit icon-editprofile"></i>
          </Link>
        </div>
        <img
          className="imgprofile"
          src={adminData.image ? adminData.image : "/img/no-image-profile.png"}
          alt=""
        />
        <div className="profile-data">
          <div className="data-box">
            <div className="profile-title">
              <p>ชื่อ :</p>
            </div>
            <div className="profile-info">
              <p>
                {adminData?.fname} {adminData?.lname}
              </p>
            </div>
          </div>
          <div className="data-box">
            <div className="profile-title">
              <p>อีเมล :</p>
            </div>
            <div className="profile-info">
              <p>{currentAuth?.email}</p>
            </div>
          </div>
          <div className="data-box">
            <div className="profile-title">
              <p>เบอร์โทรศัพท์ :</p>
            </div>
            <div className="profile-info">
              <p>{adminData?.phone}</p>
            </div>
          </div>
        </div>
        <div className="changepassword">
          <Link to="/profile/changepassword">แก้ไขรหัสผ่าน</Link>
        </div>
      </div>
    </section>
  );
}

export default Profile;
