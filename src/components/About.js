import { useEffect, useRef, useState } from "react";
import "../css/Manual.css";
import AboutItem from "./AboutItem";
import { ref as refDB, child, get, set } from "firebase/database";
import { database, storage } from "../firebase";
import { useAuth } from "../firebase";
import { addHistory } from "../myfunction";
import {
  ref as refSR,
  uploadBytesResumable,
  getDownloadURL,
} from "@firebase/storage";

import Swal from "sweetalert2";

function About() {
  const currentAuth = useAuth();

  const [showForm, setShowFrom] = useState("");

  const topic = useRef("");
  let arrImg = [];
  const description = useRef("");

  const [aboutData, setAboutData] = useState([]);

  const getAboutData = async () => {
    const dbRef = refDB(database);
    get(child(dbRef, "About/"))
      .then((snapshot) => {
        let allAboutData = [];
        if (snapshot.exists()) {
          allAboutData = snapshot.val();
        }
        setAboutData(allAboutData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAboutData();
  }, []);

  function changeIndexUp(index) {
    if (index <= 0) {
      return;
    }
    let newAboutData = aboutData;
    let tmp = newAboutData[index - 1];
    newAboutData[index - 1] = newAboutData[index];
    newAboutData[index] = tmp;
    setAboutData([]);
    setTimeout(() => {
      setAboutData(newAboutData);
    }, 200);
    try {
      set(refDB(database, "About/"), newAboutData);
    } catch (error) {
      if (error) {
        Swal.fire({
          icon: "error",
          title: "ทำรายการไม่สำเร็จ",
          text: "กรุณาทำรายการใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
        });
      }
    }
  }
  function changeIndexDown(index) {
    if (index >= aboutData.length - 1) {
      return;
    }
    let newAboutData = aboutData;
    let tmp = newAboutData[index + 1];
    newAboutData[index + 1] = newAboutData[index];
    newAboutData[index] = tmp;
    setAboutData([]);
    setTimeout(() => {
      setAboutData(newAboutData);
    }, 200);
    try {
      set(refDB(database, "About/"), newAboutData);
    } catch (error) {
      if (error) {
        Swal.fire({
          icon: "error",
          title: "ทำรายการไม่สำเร็จ",
          text: "กรุณาทำรายการใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
        });
      }
    }
  }

  function selectEditData(key) {
    setShowFrom(
      <AboutItem
        data={aboutData[key]}
        index={key}
        getAboutData={getAboutData}
        setShowFrom={setShowFrom}
        setAboutData={setAboutData}
        aboutData={aboutData}
      />
    );
  }
  const topicElements = aboutData.map((item) => {
    let index = aboutData.indexOf(item);
    return (
      <li key={index} className="learningcontent-mood manual-li-topic">
        <i
          className="bx bx-up-arrow-alt icon-change-index"
          onClick={() => {
            changeIndexUp(index);
          }}
        ></i>
        <i
          className="bx bx-down-arrow-alt icon-change-index"
          onClick={() => {
            changeIndexDown(index);
          }}
        ></i>

        <div
          className="manual-li-item"
          onClick={() => {
            selectEditData(aboutData.indexOf(item));
          }}
        >
          <span className="mood-name">{item.topic}</span>
          <i className="bx bx-chevron-right link-edit"></i>
        </div>
      </li>
    );
  });

  async function addDataManual(event) {
    event.preventDefault();
    let getTopic = topic.current.value;
    let getDescription = description.current.value;
    topic.current.value = "";
    description.current.value = "";

    const index = aboutData.length;
    const timestamp = Date.now();

    set(refDB(database, `About/${index}/`), {
      topic: getTopic,
      description: getDescription,
      updateAt: timestamp,
    })
      .then(() => {
        getAboutData();
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
        return;
      });
    arrImg.map((img) => {
      let random = Math.floor(Math.random() * 999);
      let timestampImage = Date.now() + random;
      const storageRef = refSR(storage, `/image-about/${timestampImage}`);
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => alert(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            set(refDB(database, `About/${index}/images/${timestampImage}`), url)
              .then(() => {
                set(refDB(database, `About/${index}/updateAt`), timestampImage)
                  .then(() => {
                    set(
                      refDB(
                        database,
                        `About/${index}/images/${timestampImage}`
                      ),
                      url
                    )
                      .then(() => {
                        getAboutData();
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
                        return;
                      });
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
                    return;
                  });
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
                return;
              });
          });
        }
      );
    });
    const allImage = document.getElementById("all-image-data-add");
    allImage.innerHTML = "";
    Swal.fire({
      title: "เพิ่มหัวข้อสำเร็จ",
      icon: "success",
      confirmButtonText: "ตกลง",
    });
    setShowFrom("");

    // add history
    addHistory(
      currentAuth.uid,
      currentAuth.email,
      "เพิ่มเกี่ยวกับแอปพลิเคชัน",
      `เพิ่มเกี่ยวกับแอปพลิเคชัน ${getTopic}`
    );
    // ***********************
  }

  function deleteAddImage(id, image) {
    const deleteElem = document.getElementById(id);
    deleteElem.style.display = "none";

    let newArrImg = arrImg.filter((data) => data !== image);
    arrImg = newArrImg;
  }

  function onAddImageSelect() {
    const imageData = document.getElementById("input-img-data").files[0];
    if (!imageData) {
      return;
    }
    arrImg.push(imageData);
    const timestamp = Date.now();
    let render = new FileReader();
    render.onload = function () {
      const allImage = document.getElementById("all-image-data-add");
      const box = document.createElement("div");
      box.id = timestamp;
      const icon = document.createElement("i");
      const img = document.createElement("img");
      box.className = "moodedit-img-box";
      icon.className = "bx bx-trash delete-icon";
      icon.onclick = function () {
        deleteAddImage(timestamp, imageData);
      };
      img.className = "moodedit-img";
      img.src = render.result;
      img.alt = "";
      box.appendChild(icon);
      box.appendChild(img);
      allImage.appendChild(box);
    };
    render.readAsDataURL(imageData);
  }

  const addData = (
    <div className="learningcontent-edit">
      <form onSubmit={addDataManual}>
        <div className="editcontent-topic">
          <input ref={topic} type="text" placeholder="หัวข้อ" required />
        </div>
        <div className="moodedit-topic">รูปภาพ</div>
        <div id="all-image-data-add"></div>
        <div className="moodedit-addimg">
          <label
            className="addimg"
            onClick={() => {
              document.getElementById("input-img-data").click();
            }}
          >
            เพิ่มรูปภาพ
          </label>
          <input
            className="show-none"
            type="file"
            name="filenameimg"
            id="input-img-data"
            accept="image/x-png,image/gif,image/jpeg"
            onChange={onAddImageSelect}
          />
        </div>
        <div className="moodedit-topic moodedit-description">คำอธิบาย</div>
        <textarea ref={description} cols="30" rows="5"></textarea>
        <button type="submit">ตกลง</button>
      </form>
    </div>
  );

  return (
    <section className="container">
      <div className="text">เกี่ยวกับแอปพลิเคชัน</div>
      <div className="learningcontent">
        <div className="learningcontent-topic">
          <ul className="learningcontent-mood-link">
            <li
              className="learningcontent-mood exam-addexam"
              onClick={() => {
                setShowFrom(addData);
              }}
            >
              <span className="add-title-data">เพิ่มหัวข้อ</span>
            </li>

            {topicElements}
          </ul>
        </div>
        {showForm}
      </div>
    </section>
  );
}

export default About;
