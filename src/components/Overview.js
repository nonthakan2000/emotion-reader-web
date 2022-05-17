import "../css/Overview.css";
import LineChart from "../charts/LineChart";
import { useEffect } from "react";

function Overview() {
  useEffect(() => {
    try {
      document.getElementById("navigatione-sidebar").classList.remove("show-none");
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
        <div className="index-box">
          <div className="active-todaybox">
            <h4 className="index-active-topic">
              <i className="bx bx-bar-chart-square index-active-icon"></i>
              การเคลื่อนไหว
            </h4>
            <div className="activetoday">
              <p>จำนวนผู้ใช้งานในวันนี้</p>
              <ul>
                <li className="active-infobox">
                  <div className="active-info-icon">
                    <i className="bx bx-happy index-icon"></i>
                  </div>
                  <div className="active-info-data">
                    <h3 className="active-data-sum">35</h3>
                    <h5 className="active-data-text">
                      ผู้ใช้งานแบบไม่ระบุตัวตน
                    </h5>
                  </div>
                </li>
                <li className="active-infobox">
                  <div className="active-info-icon">
                    <i className="bx bxl-google index-icon"></i>
                  </div>
                  <div className="active-info-data">
                    <h3 className="active-data-sum">125</h3>
                    <h5 className="active-data-text">ผู้ใช้งานด้วย Google</h5>
                  </div>
                </li>

                <li className="active-infobox">
                  <div className="active-info-icon">
                    <i className="bx bxs-contact index-icon"></i>
                  </div>
                  <div className="active-info-data">
                    <h3 className="active-data-sum">160</h3>
                    <h5 className="active-data-text">ผู้ใช้งานวันนี้ทั้งหมด</h5>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="index-active-box">
            <div className="chart">
              <LineChart
                id="index-active-chart"
                className="index-active-chart"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;
