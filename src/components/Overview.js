import "../css/Overview.css";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import DoughnutChart from "../charts/DoughnutChart";
import { useEffect, useState } from "react";

// firebase
import { database } from "../firebase";
import { ref as refDB, get, child } from "firebase/database";

function Overview() {
  const [googleUsers, setGoogleUsers] = useState({});
  const [anonymousUsers, setAnonymousUsers] = useState(0);
  const [deleteUsers, setDeleteUsers] = useState(0);
  const [adminUsers, setAdminUsers] = useState(0);
  const [genderData, setGenderData] = useState({});
  const [dateOfBirthData, setDateOfBirthData] = useState([]);
  useEffect(() => {
    try {
      document
        .getElementById("navigatione-sidebar")
        .classList.remove("show-none");

      // get googloe users
      const dbRef = refDB(database);
      get(child(dbRef, "Users/")).then((snapshot) => {
        let data = {};
        if (snapshot.exists()) {
          data = snapshot.val();
        }
        const tmpData = {};
        const totalUsers = Object.keys(data).length;
        tmpData.totalUsers = totalUsers;
        setGoogleUsers(tmpData);
        // gender
        let male = 0;
        let female = 0;
        let other = 0;
        let nodata = 0;
        // dateOfBirth
        let dateOfBirth = Array(5).fill(0);
        for (const user in data) {
          const dataUser = data[user].UserData;
          // check gender
          switch (dataUser.gender) {
            case "male":
              male++;
              break;
            case "female":
              female++;
              break;
            case "other":
              other++;
              break;
            default:
              nodata++;
          }

          // check dateOfBirth
          if (!!dataUser.dateOfBirth) {
            const [day, month, year] = dataUser.dateOfBirth.split("-");
            const date = new Date(+year, month - 1, +day);
            const now = new Date();
            const age =
              parseInt(now.getFullYear()) - parseInt(date.getFullYear());

            if (age < 15) {
              dateOfBirth[0]++;
            } else if (age < 25) {
              dateOfBirth[1]++;
            } else if (age < 60) {
              dateOfBirth[2]++;
            } else {
              dateOfBirth[3]++;
            }
          }else{
            dateOfBirth[4]++;
          }
        }
        setGenderData({ male, female, other, nodata });
        setDateOfBirthData(dateOfBirth);
      });

      // get anonymous users
      get(child(dbRef, "Anonymous/")).then((snapshot) => {
        let data = 0;
        if (snapshot.exists()) {
          data = snapshot.val();
        }
        setAnonymousUsers(data);
      });

      // get delete account
      get(child(dbRef, "DeleteAccount/")).then((snapshot) => {
        let data = {};
        if (snapshot.exists()) {
          data = snapshot.val();
        }
        setDeleteUsers(Object.keys(data).length);
      });

      // get dadmin
      get(child(dbRef, "Admin/")).then((snapshot) => {
        let data = [];
        if (snapshot.exists()) {
          const tmpData = snapshot.val();
          for (const admin in tmpData) {
            if (tmpData[admin].status) {
              data.push(admin);
            }
          }
        }

        setAdminUsers(data.length);
      });
    } catch (error) {}
  }, []);
  return (
    <section className="container">
      <div className="text">ภาพรวมระบบ</div>
      <div className="index">
        <div className="index-bar">
          <ul>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bx-happy index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">{anonymousUsers}</h3>
                <h5 className="info-data-text">ผู้ใช้งานแบบไม่ระบุตัวตน</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bxl-google index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">
                  {!!googleUsers.totalUsers ? googleUsers.totalUsers : 0}
                </h3>
                <h5 className="info-data-text">ผู้ใช้งานด้วย Google</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bxs-contact index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">
                  {!!googleUsers.totalUsers
                    ? googleUsers.totalUsers + anonymousUsers
                    : 0}
                </h3>
                <h5 className="info-data-text">ผู้ใช้งานทั้งหมด</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bx-support index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">{adminUsers}</h3>
                <h5 className="info-data-text">ผู้ดูแลระบบทั้งหมด</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bxs-trash index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">{deleteUsers}</h3>
                <h5 className="info-data-text">การลบบัญชี</h5>
              </div>
            </li>
          </ul>
        </div>
        <div className="index-active">
          <div className="index-active-one">
            <div className="box-one-title">
              <h2>ความเคลื่อนไหว</h2>
              <div className="select-time-box">
                <div className="select-time">
                  ช่วง&nbsp;
                  <select>
                    <option value="">&nbsp;dd/mm/yyyy&nbsp;</option>
                    <option value="">&nbsp;dd/mm/yyyy&nbsp;</option>
                    <option value="">&nbsp;dd/mm/yyyy&nbsp;</option>
                  </select>
                  &nbsp;ถึง&nbsp;
                  <select>
                    <option value="">&nbsp;dd/mm/yyyy&nbsp;</option>
                    <option value="">&nbsp;dd/mm/yyyy&nbsp;</option>
                    <option value="">&nbsp;dd/mm/yyyy&nbsp;</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="chart">
              <LineChart
                id="index-active-chart"
                className="index-active-chart"
              />
            </div>
            <div className="chart-mobile">
              <ul>
                <li>ผู้ใช้งานด้วย Google : 5 คน</li>
                <li>ผู้ใช้งานแบบไม่ระบุตัวตน : 20 คน</li>
                <li>ผู้ใช้งานทั้งหมด : 30 คน</li>
              </ul>
            </div>
          </div>
          <div className="index-active-two">
            <div className="activity-chart">
              <h4>อายุ</h4>
              <div className="chart">
                <BarChart
                  id="index-active-chart"
                  className="index-active-chart"
                  dateOfBirth={dateOfBirthData}
                />
              </div>
              <div className="chart-mobile">
                <ul>
                  <li>อายุ 10-15 : 5 คน</li>
                  <li>อายุ 16-20 : 20 คน</li>
                  <li>อายุ 21-25 : 30 คน</li>
                  <li>อายุ 26-30 : 5 คน</li>
                  <li>อายุ 31-35 : 20 คน</li>
                  <li>อายุ 35-40 : 30 คน</li>
                </ul>
              </div>
            </div>
            <hr className="linebox"></hr>
            <div className="activity-chart">
              <h4>เพศ</h4>
              <div className="chart">
                <DoughnutChart
                  id="index-active-chart"
                  className="index-active-chart"
                  genderData={Object.values(genderData)}
                />
              </div>
              <div className="chart-mobile">
                <ul>
                  <li>เพศชาย : {!!genderData.male ? genderData.male : 0} คน</li>
                  <li>
                    เพศหญิง : {!!genderData.female ? genderData.female : 0} คน
                  </li>
                  <li>
                    เพศทางเลือก : {!!genderData.other ? genderData.other : 0} คน
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
