import "../css/History.css";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref as refDB, get, child } from "firebase/database";
import { getKeyHistory } from "../myfunction";
import ReactPaginate from "react-paginate";

function History() {
  const [allHistory, setAllHistory] = useState({});
  const [arrayHistory, setArrayHistory] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterUsage, setFilterUsage] = useState("");

  const [page, setPage] = useState(0);
  const historyPerPage = 12;
  const [numberOfHistoryVistited, setNumberOfHistoryVistited] = useState(
    page * historyPerPage
  );
  const [totalPages, setTotalPages] = useState(0);

  const arrayMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  function getHistory() {
    const dbRef = refDB(database);
    get(child(dbRef, "History/")).then((snapshot) => {
      let allHistory = {};
      if (snapshot.exists()) {
        allHistory = snapshot.val();
      }
      setAllHistory(allHistory);
    });
  }
  useEffect(() => {
    let date = new Date();
    let filterDate = date.getMonth() + "-" + date.getFullYear();
    setFilterDate(filterDate);
    getHistory();
    try {
      document
        .getElementById("navigatione-sidebar")
        .classList.remove("show-none");
    } catch (error) {}
  }, []);

  useEffect(() => {
    selectHistory(filterDate);
  }, [filterDate]);
  useEffect(() => {
    selectHistory(filterDate);
  }, [allHistory]);
  useEffect(() => {
    selectHistory(filterDate);
  }, [filterUsage]);

  let arrayDay = [];
  function selectHistory(filterDate) {
    setArrayHistory([]);
    arrayDay = [];
    const dataHistory = allHistory[filterDate];
    try {
      let arrayHistory = [];
      Object.keys(dataHistory).forEach((key) => {
        const value = dataHistory[key];
        const keyHistory = getKeyHistory(value.createAt);
        let history = {
          day: keyHistory.day,
          time: keyHistory.time,
          uid: value.uid,
          email: value.email,
          usage: value.usage,
          ipAddress: value.ipAddress,
          description: value.description,
          createAt: value.createAt,
        };
        arrayHistory.push(history);
      });
      const tmpArrayHistory = arrayHistory.filter((history) => {
        try {
          return history.usage.includes(filterUsage);
        } catch (error) {}
      });
      setArrayHistory(tmpArrayHistory);
      setPage(0);
      setNumberOfHistoryVistited(0);
      setTotalPages(Math.ceil(tmpArrayHistory.length / historyPerPage));
    } catch (error) {}
  }

  const changePage = ({ selected }) => {
    setPage(selected);
    setNumberOfHistoryVistited(selected * historyPerPage);
  };

  // ****

  const historyElements = arrayHistory
    .slice(numberOfHistoryVistited, numberOfHistoryVistited + historyPerPage)
    .map((history) => {
      if (!arrayDay.includes(history.day)) {
        arrayDay.push(history.day);
        return (
          <tr key={history.createAt}>
            <td>{history.day}</td>
            <td>{history.time}</td>
            <td>{history.usage}</td>
            <td>{history.email}</td>
            <td>{history.ipAddress}</td>
            <td>{history.description}</td>
          </tr>
        );
      } else {
        return (
          <tr key={history.createAt}>
            <td>{""}</td>
            <td>{history.time}</td>
            <td>{history.usage}</td>
            <td>{history.email}</td>
            <td>{history.ipAddress}</td>
            <td>{history.description}</td>
          </tr>
        );
      }
    });

  // ********

  function getNameMonth(filterDate) {
    let data = filterDate.split("-");
    let month = data[0];
    let year = parseInt(data[1]) + 543;
    let nameMonth = `${arrayMonths[month]} ${year}`;
    return nameMonth;
  }

  function upMonthYear() {
    let data = filterDate.split("-");
    let month = parseInt(data[0]);
    let year = parseInt(data[1]);
    month += 1;
    if (month < 12) {
      setFilterDate(`${month}-${year}`);
    } else {
      setFilterDate(`${0}-${year + 1}`);
    }
  }
  function downMonthYear() {
    let data = filterDate.split("-");
    let month = parseInt(data[0]);
    let year = parseInt(data[1]);
    month -= 1;
    if (month > -1) {
      setFilterDate(`${month}-${year}`);
    } else {
      setFilterDate(`${11}-${year - 1}`);
    }
  }

  function changeUsage(e) {
    setFilterUsage(e.target.value);
  }
  return (
    <section className="container">
      <div className="text">ประวัติการใช้งาน</div>
      <div className="history">
        <div className="filter">
          <div className="filter-time">
            <i className="bx bx-chevron-left icon" onClick={downMonthYear}></i>
            <div id="show-month-year">
              <span>{getNameMonth(filterDate)}</span>
            </div>
            <i className="bx bx-chevron-right icon" onClick={upMonthYear}></i>
          </div>

          <select onChange={changeUsage}>
            <option value="">ทั้งหมด</option>
            <option value="เพิ่มผู้ดูแลระบบ">เพิ่มผู้ดูแลระบบ</option>
            <option value="ลบผู้ดูแลระบบ">ลบผู้ดูแลระบบ</option>
            <option value="เพิ่มรูปภาพเนื้อหา">เพิ่มรูปภาพเนื้อหา</option>
            <option value="ลบรูปภาพเนื้อหา">ลบรูปภาพเนื้อหา</option>
            <option value="แก้ไขเนื้อหา">แก้ไขเนื้อหา</option>
            <option value="เพิ่มข้อสอบ">เพิ่มข้อสอบ</option>
            <option value="ลบข้อสอบ">ลบข้อสอบ</option>
            <option value="เพิ่มคำแนะนำการใช้งาน">เพิ่มคำแนะนำการใช้งาน</option>
            <option value="ลบคำแนะนำการใช้งาน">ลบคำแนะนำการใช้งาน</option>
            <option value="เพิ่มรูปภาพคำแนะนำการใช้งาน">
              เพิ่มรูปภาพคำแนะนำการใช้งาน
            </option>
            <option value="ลบรูปภาพคำแนะนำการใช้งาน">
              ลบรูปภาพคำแนะนำการใช้งาน
            </option>
            <option value="แก้ไขคำแนะนำการใช้งาน">แก้ไขคำแนะนำการใช้งาน</option>
            <option value="เพิ่มเกี่ยวกับแอปพลิเคชัน">
              เพิ่มเกี่ยวกับแอปพลิเคชัน
            </option>
            <option value="ลบเกี่ยวกับแอปพลิเคชัน">
              ลบเกี่ยวกับแอปพลิเคชัน
            </option>
            <option value="เพิ่มรูปภาพเกี่ยวกับแอปพลิเคชัน">
              เพิ่มรูปภาพเกี่ยวกับแอปพลิเคชัน
            </option>
            <option value="ลบรูปภาพเกี่ยวกับแอปพลิเคชัน">
              ลบรูปภาพเกี่ยวกับแอปพลิเคชัน
            </option>
            <option value="แก้ไขเกี่ยวกับแอปพลิเคชัน">
              แก้ไขเกี่ยวกับแอปพลิเคชัน
            </option>
          </select>
        </div>
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>เวลา</th>
                <th>การใช้งาน</th>
                <th>ผู้ใช้งาน</th>
                <th>จาก (IP)</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>{historyElements}</tbody>
          </table>
          {arrayHistory.length > 0 ? (
            ""
          ) : (
            <div id="null-history">ยังไม่มีประวัติการใช้งาน</div>
          )}
        </div>
        <ReactPaginate
          forcePage={page}
          previousLabel={"ก่อนหน้า"}
          nextLabel={"ถันไป"}
          pageCount={totalPages}
          onPageChange={changePage}
          containerClassName={"navigationButtons"}
          previousLinkClassName={"previousButton"}
          nextLinkClassName={"nextButton"}
          disabledClassName={"navigationDisabled"}
          activeClassName={"navigationActive"}
        />
      </div>
    </section>
  );
}

export default History;
