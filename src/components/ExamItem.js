import { useEffect, useState } from "react";
import { storage, database } from "../firebase";
import { getDateTime } from "../myfunction";
import { ref as refSR, deleteObject } from "firebase/storage";
import { ref as refDB, remove } from "firebase/database";

import { addHistory } from "../myfunction";

import Swal from "sweetalert2";

function ExamItem(props) {
  const { exam, title, getExam, currentAuth } = props;
  const [arrayExam, setArrayExam] = useState("");
  const [fullImage, setFullImage] = useState(null);

  function deleteExam(key) {
    Swal.fire({
      title: "คุณต้องการลบข้อสอบข้อนี้หรือไม่ ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const desertRef = refSR(storage, `/image-exam/${key}`);
        // Delete the Image
        deleteObject(desertRef)
          .then(() => {
            remove(refDB(database, "Exams/" + key))
              .then(() => {
                document.getElementById(key).style.display = "none";
                Swal.fire({
                  title: "ลบข้อสอบสำเร็จ",
                  icon: "success",
                  button: "ตกลง",
                });
                // add history
                addHistory(
                  currentAuth.uid,
                  currentAuth.email,
                  "ลบข้อสอบ",
                  `ลบข้อสอบของอารมณ์${title}`
                );
                // ***********************
                getExam();
              })
              .catch((error) => {
                // The write failed...
                if (error) {
                  Swal.fire({
                    title: "ลบข้อสอบไม่สำเร็จ",
                    text: "กรุณาทำรายการใหม่อีกครั้ง",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                  });
                }
              });
          })
          .catch((error) => {
            // Uh-oh, an error occurred!
            if (error) {
              Swal.fire({
                icon: "error",
                title: "ทำรายการไม่สำเร็จ",
                text: "กรุณาทำรายการใหม่อีกครั้ง",
                confirmButtonText: "ตกลง",
              });
            }
          });
      }
    });
  }

  let imageFull = "";
  if (!!fullImage) {
    imageFull = (
      <div id="box-image-full">
        <div
          id="bg-image-full"
          onClick={() => {
            setFullImage(null);
          }}
        ></div>
        <img id="show-image-full" src={fullImage} alt="" />
      </div>
    );
  }

  useEffect(() => {
    let dataExam = [];
    try {
      Object.keys(exam).forEach((key) => {
        const value = exam[key];
        let dateTime = getDateTime(value.createAt);
        dataExam.push({
          key: key,
          answer: value.answer,
          image: value.image,
          date: dateTime,
        });
      });
    } catch (error) {}
    let allExamList = (
      <ul id="ul-exam-item">
        {dataExam.map((item) => (
          <li className="exam-mood" id={item?.key} key={item?.key}>
            <img
              className="exam-mood-img"
              src={item?.image}
              alt=""
              onClick={() => {
                setFullImage(item?.image);
              }}
            />
            <span className="articel">สร้างเมื่อ {item?.date}</span>
            <i
              className="bx bx-trash link-edit"
              onClick={() => {
                deleteExam(item?.key);
              }}
            ></i>
          </li>
        ))}
      </ul>
    );
    setArrayExam(allExamList);
  }, [exam]);

  return (
    <div className="exam-add">
      {imageFull}
      <span className="exam-addexam-box">{title}</span>
      <div id="show-all-exam">
        <div className="exam-moodlist">{arrayExam}</div>
      </div>
    </div>
  );
}

export default ExamItem;
