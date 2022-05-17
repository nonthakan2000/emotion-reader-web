import "../css/Exam.css";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../firebase";
import { addHistory } from "../myfunction";
import { database, storage } from "../firebase";
import { ref as refDB, child, get, set } from "firebase/database";
import {
  ref as refSR,
  uploadBytesResumable,
  getDownloadURL,
} from "@firebase/storage";

import ExamItem from "./ExamItem";
import Swal from "sweetalert2";

function Exam() {
  const currentAuth = useAuth();
  const [showFrom, setShowFrom] = useState("");
  const [exam, setExam] = useState({});
  const [numExam, setNumExam] = useState({});
  const answer = useRef("");

  const emotional = {
    normal: "ปกติ",
    happy: "มีความสุข",
    surprised: "ประหลาดใจ",
    sad: "เศร้า",
    fear: "กลัว",
    angry: "โกธร",
    disgust: "รังเกียจ",
  };

  const getExam = async () => {
    const dbRef = refDB(database);
    get(child(dbRef, "Exams"))
      .then((snapshot) => {
        let allExam = {};
        let num = {};
        if (snapshot.exists()) {
          let dataExam = snapshot.val();
          for (const key in dataExam) {
            try {
              allExam[dataExam[key]["answer"]][key] = dataExam[key];
              num[dataExam[key]["answer"]] += 1;
            } catch (error) {
              allExam[dataExam[key]["answer"]] = {};
              allExam[dataExam[key]["answer"]][key] = dataExam[key];
              num[dataExam[key]["answer"]] = 1;
            }
          }
        }
        setExam(allExam);
        setNumExam(num);
      })
      .catch((error) => {
        if (error) {
          Swal.fire({
            icon: "error",
            title: "ทำรายการไม่สำเร็จ",
            text: "กรุณาทำรายการใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
          });
        }
      });
  };

  useEffect(() => {
    getExam();
  }, []);

  function onSubmitAddExam(event) {
    event.preventDefault();
    const aws = answer.current.value;
    const imageExam = event.target[1].files[0];

    if (!imageExam) {
      Swal.fire({
        title: "กรุณาเลือกรูปภาพ",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    const timestamp = Date.now();

    answer.current.value = "";
    event.target[1].value = "";
    document.getElementById("image-exam").src = "/img/no-image-exam.png";

    const storageRef = refSR(storage, `/image-exam/${timestamp}`);
    const uploadTask = uploadBytesResumable(storageRef, imageExam);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => alert(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          try {
            set(refDB(database, "Exams/" + timestamp), {
              answer: aws,
              image: url,
              createAt: timestamp,
            });
            Swal.fire({
              title: "เพิ่มข้อสอบสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            getExam();
            // add history
            addHistory(
              currentAuth.uid,
              currentAuth.email,
              "เพิ่มข้อสอบ",
              `เพิ่มข้อสอบของอารมณ์${emotional[aws]}`
            );
            // ***********************
          } catch (error) {
            if (error) {
              Swal.fire({
                title: "เพิ่มข้อสอบไม่สำเร็จ",
                text: "กรุณาทำรายการใหม่อีกครั้ง",
                icon: "error",
                confirmButtonText: "ตกลง",
              });
            }
          }
        });
      }
    );
  }

  function onChangeImage(event) {
    event.preventDefault();
    const image = document.getElementById("input-image-exam").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      let examImage = document.getElementById("image-exam");
      examImage.src = e.target.result;
    };
    reader.readAsDataURL(image);
  }

  const addExam = (
    <div className="exam-add">
      <span className="exam-addexam-box">เพิ่มข้อสอบ</span>
      <form onSubmit={onSubmitAddExam}>
        <div className="exam-selectmood">เลือกคำตอบ</div>
        <select
          ref={answer}
          name="selectanswer"
          className="selectmood"
          required
        >
          <option value="" hidden>
            กรุณาเลือกคำตอบ
          </option>
          <option value="normal">ปกติ</option>
          <option value="happy">มีความสุข</option>
          <option value="surprised">ประหลาดใจ</option>
          <option value="sad">เศร้า</option>
          <option value="fear">กลัว</option>
          <option value="angry">โกธร</option>
          <option value="disgust">รังเกียจ</option>
        </select>
        <div className="exam-selectmood">เลือกรูปภาพ</div>
        <img
          className="exam-img"
          id="image-exam"
          src="/img/no-image-exam.png"
          alt=""
          onClick={() => {
            document.getElementById("input-image-exam").click();
          }}
        />
        <div className="exam-addimg">
          <label
            className="add-img"
            onClick={() => {
              document.getElementById("input-image-exam").click();
            }}
          >
            เพิ่มรูปภาพ
          </label>
          <input
            className="show-none"
            id="input-image-exam"
            type="file"
            onChange={onChangeImage}
            accept="image/x-png,image/gif,image/jpeg"
          />
        </div>
        <button type="submit">ตกลง</button>
      </form>
    </div>
  );

  function selectEditExam(eid, title) {
    setShowFrom(<ExamItem exam={exam[eid]} title={title} getExam={getExam} currentAuth={currentAuth}/>);
  }

  return (
    <section className="container">
      <div className="text">ข้อสอบการรับรู้</div>
      <div className="exam">
        <div className="exam-topic">
          <ul className="exam-mood-link">
            <li
              className="exam-addexam"
              onClick={() => {
                setShowFrom(addExam);
              }}
            >
              <span className="add-exam">เพิ่มข้อสอบ</span>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("normal", "ปกติ");
              }}
            >
              <i className="bx bx-meh mood-icon"></i>
              <span className="exam-mood-name">
                ปกติ ({numExam["normal"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("happy", "มีความสุข");
              }}
            >
              <i className="bx bx-happy-alt mood-icon"></i>
              <span className="exam-mood-name">
                มีความสุข ({numExam["happy"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("surprised", "ประหลาดใจ");
              }}
            >
              <i className="bx bx-shocked mood-icon"></i>
              <span className="exam-mood-name">
                ประหลาดใจ ({numExam["surprised"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("sad", "เศร้า");
              }}
            >
              <i className="bx bx-sad mood-icon"></i>
              <span className="exam-mood-name">
                เศร้า ({numExam["sad"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("fear", "กลัว");
              }}
            >
              <i className="bx bx-tired mood-icon"></i>
              <span className="exam-mood-name">
                กลัว ({numExam["fear"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("angry", "โกรธ");
              }}
            >
              <i className="bx bx-angry mood-icon"></i>
              <span className="exam-mood-name">
                โกรธ ({numExam["angry"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="exam-mood-box"
              onClick={() => {
                selectEditExam("disgust", "รังเกียจ");
              }}
            >
              <i className="bx bx-confused mood-icon"></i>
              <span className="exam-mood-name">
                รังเกียจ ({numExam["disgust"] || "0"})
              </span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
          </ul>
        </div>
        {showFrom}
      </div>
    </section>
  );
}

export default Exam;
