import "../css/Overview.css";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import DoughnutChart from "../charts/DoughnutChart";
import { useEffect } from "react";

function Overview() {
  useEffect(() => {
    try {
      document
        .getElementById("navigatione-sidebar")
        .classList.remove("show-none");
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
                <h3 className="info-data-sum">52</h3>
                <h5 className="info-data-text">ผู้ใช้งานแบบไม่ระบุตัวตน</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bxl-google index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">200</h3>
                <h5 className="info-data-text">ผู้ใช้งานด้วย Google</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bxs-contact index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">252</h3>
                <h5 className="info-data-text">ผู้ใช้งานทั้งหมด</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bx-support index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">2</h3>
                <h5 className="info-data-text">ผู้ดูแลระบบทั้งหมด</h5>
              </div>
            </li>
            <li className="index-infobox">
              <div className="index-info-icon">
                <i className="bx bxs-trash index-icon"></i>
              </div>
              <div className="index-info-data">
                <h3 className="info-data-sum">0</h3>
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
                />
              </div>
              <div className="chart-mobile">
                <ul>
                  <li>เพศชาย : 5 คน</li>
                  <li>เพศหญิง : 20 คน</li>
                  <li>เพศทางเลือก : 30 คน</li>
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
