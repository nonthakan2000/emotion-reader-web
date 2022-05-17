
import "../css/Content.css";
import { useState } from "react";
import ContentItem from "./ContentItem";
import { useEffect } from "react";

import { database } from "../firebase";
import { ref, child, get } from "firebase/database";

import Swal from "sweetalert2";

function Content() {
  const [editContent, setEditContent] = useState("");
  const [emotional, setEmotional] = useState({});

  const getEmotional = async () => {
    const dbRef = ref(database);
    get(child(dbRef, "Contents"))
      .then((snapshot) => {
        let allEmotional = {};
        if (snapshot.exists()) {
          allEmotional = snapshot.val();
        }
        setEmotional(allEmotional);
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
    getEmotional();
  }, []);

  function selectEditContent(eid) {
    let dataEmotional = {};
    if (emotional[eid]) {
      dataEmotional = emotional[eid];
    }
    setEditContent(
      <ContentItem
        eid={eid}
        emotional={dataEmotional}
        setEditContent={setEditContent}
        setEmotional={setEmotional}
      />
    );
  }

  return (
    <section className="container">
      <div className="text">เนื้อหาการเรียนรู้</div>
      <div className="learningcontent">
        <div className="learningcontent-topic">
          <ul className="learningcontent-mood-link">
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("normal");
              }}
            >
              <i className="bx bx-meh mood-icon"></i>
              <span className="mood-name">ปกติ</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("happy");
              }}
            >
              <i className="bx bx-happy-alt mood-icon"></i>
              <span className="mood-name">มีความสุข</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("surprised");
              }}
            >
              <i className="bx bx-shocked mood-icon"></i>
              <span className="mood-name">ประหลาดใจ</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("sad");
              }}
            >
              <i className="bx bx-sad mood-icon"></i>
              <span className="mood-name">เศร้า</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("fear");
              }}
            >
              <i className="bx bx-tired mood-icon"></i>
              <span className="mood-name">กลัว</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("angry");
              }}
            >
              <i className="bx bx-angry mood-icon"></i>
              <span className="mood-name">โกรธ</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
            <li
              className="learningcontent-mood"
              onClick={() => {
                selectEditContent("disgust");
              }}
            >
              <i className="bx bx-confused mood-icon"></i>
              <span className="mood-name">รังเกียจ</span>
              <i className="bx bx-chevron-right link-edit"></i>
            </li>
          </ul>
        </div>
        {editContent}
      </div>
    </section>
  );
}

export default Content;
