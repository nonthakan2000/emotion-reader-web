import { useEffect, useRef, useState } from "react";
import { getDateTime } from "../myfunction";
import { ref as refDB, child, get, set, remove } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as refSR,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "@firebase/storage";

import Swal from "sweetalert2";
import { addHistory } from "../myfunction";

function AboutItem(props) {
  const {
    data,
    index,
    getAboutData,
    setShowFrom,
    setAboutData,
    aboutData,
    currentAuth,
  } = props;
  const topic = useRef(data?.topic);
  const description = useRef("");
  const [fullImage, setFullImage] = useState(null);
  const images = data.images ? data?.images : {};
  const [allImageShow, setAllImageShow] = useState(
    <div id="all-image-contents" />
  );

  function deleteImageContent(key) {
    Swal.fire({
      title: "คุณต้องการลบรูปภาพหรือไม่ ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const desertRef = refSR(storage, `/image-about/${key}`);
        // Delete the Image
        deleteObject(desertRef)
          .then(() => {
            remove(refDB(database, `About/${index}/images/${key}`))
              .then(() => {
                const dbRef = refDB(database);
                get(child(dbRef, "About/"))
                  .then((snapshot) => {
                    let allAboutData = {};
                    if (snapshot.exists()) {
                      allAboutData = snapshot.val();
                    }
                    setAboutData(allAboutData);
                    setShowFrom(
                      <AboutItem
                        data={allAboutData[index]}
                        index={index}
                        getAboutData={getAboutData}
                        setShowFrom={setShowFrom}
                        setAboutData={setAboutData}
                        aboutData={aboutData}
                      />
                    );
                    // add history
                    addHistory(
                      currentAuth.uid,
                      currentAuth.email,
                      "ลบรูปภาพเกี่ยวกับแอปพลิเคชัน",
                      `ลบรูปภาพเกี่ยวกับแอปพลิเคชัน ${data?.topic}`
                    );
                    // ***********************
                  })
                  .catch((error) => {
                    Swal.fire({
                      icon: "error",
                      title: "ทำรายการไม่สำเร็จ",
                      text: "กรุณาทำรายการใหม่อีกครั้ง",
                      confirmButtonText: "ตกลง",
                    });
                  });
              })
              .catch((error) => {
                // The write failed...
                Swal.fire({
                  icon: "error",
                  title: "ทำรายการไม่สำเร็จ",
                  text: "กรุณาทำรายการใหม่อีกครั้ง",
                  confirmButtonText: "ตกลง",
                });
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

  function getShowImage() {
    let allListImage = [];
    Object.keys(images).forEach((key) => {
      allListImage.push({
        key: key,
        image: images[key],
      });
    });
    let allImagesBox = (
      <div id="all-image-contents">
        {allListImage.map((data) => (
          <div id={data.key} key={data.key} className="moodedit-img-box">
            <i
              className="bx bx-trash delete-icon"
              onClick={() => {
                deleteImageContent(data?.key);
              }}
            ></i>
            <img
              className="moodedit-img"
              src={data.image}
              alt=""
              onClick={() => {
                setFullImage(data?.image);
              }}
            />
          </div>
        ))}
      </div>
    );

    setAllImageShow(allImagesBox);
  }

  useEffect(() => {
    topic.current.value = data.topic ? data?.topic : "";
    description.current.value = data.description ? data?.description : "";
    getShowImage();
  }, [data]);

  function addImageContent(event) {
    event.preventDefault();
    const imageContent = document.getElementById("input-img-content").files[0];
    if (!imageContent) {
      return;
    }
    const timestamp = Date.now();
    const storageRef = refSR(storage, `/image-about/${timestamp}`);
    const uploadTask = uploadBytesResumable(storageRef, imageContent);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => alert(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          try {
            set(refDB(database, `About/${index}/images/${timestamp}`), url)
              .then(() => {
                const dbRef = refDB(database);
                get(child(dbRef, "About/"))
                  .then((snapshot) => {
                    let allAboutData = {};
                    if (snapshot.exists()) {
                      allAboutData = snapshot.val();
                    }
                    setAboutData(allAboutData);
                    setShowFrom(
                      <AboutItem
                        data={allAboutData[index]}
                        index={index}
                        getAboutData={getAboutData}
                        setShowFrom={setShowFrom}
                        setAboutData={setAboutData}
                        aboutData={aboutData}
                      />
                    );

                    // add history
                    addHistory(
                      currentAuth.uid,
                      currentAuth.email,
                      "เพิ่มรูปภาพเกี่ยวกับแอปพลิเคชัน",
                      `เพิ่มรูปภาพเกี่ยวกับแอปพลิเคชัน ${data?.topic}`
                    );
                    // ***********************
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
        });
      }
    );
  }

  function deleteManual(index) {
    Swal.fire({
      title: "คุณต้องการลบหัวข้อนี้หรือไม่ ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let newData = aboutData;
        let getTopic = aboutData[index].topic;
        newData.push(newData.splice(index, 1)[0]);
        newData.pop();
        set(refDB(database, "About/"), newData)
          .then(() => {
            getAboutData();
            Swal.fire({
              title: "ลบหัวข้อสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });

            // add history
            addHistory(
              currentAuth.uid,
              currentAuth.email,
              "ลบเกี่ยวกับแอปพลิเคชัน",
              `ลบเกี่ยวกับแอปพลิเคชัน ${getTopic}`
            );
            // ***********************
            setShowFrom("");
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
        Object.keys(images).forEach((key) => {
          let desertRef = refSR(storage, `/image-about/${key}`);
          // Delete the Image
          deleteObject(desertRef)
            .then(() => {})
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
              return;
            });
        });
      }
    });
  }

  function onSubmitManual(event) {
    event.preventDefault();
    const newTopic = topic.current.value;
    const newDescription = description.current.value;

    const timestamp = Date.now();

    set(refDB(database, `About/${index}/topic`), newTopic)
      .then(() => {
        set(refDB(database, `About/${index}/description`), newDescription)
          .then(() => {
            set(refDB(database, `About/${index}/updateAt`), timestamp)
              .then(() => {
                Swal.fire({
                  title: "บันทึกข้อมูลสำเร็จ",
                  icon: "success",
                  button: "ตกลง",
                });
                let dateTime = getDateTime(timestamp);
                document.getElementById("updateAt-show").innerHTML =
                  "อัปเดตล่าสุดเมื่อ " + dateTime;
                // add history
                addHistory(
                  currentAuth.uid,
                  currentAuth.email,
                  "แก้ไขเกี่ยวกับแอปพลิเคชัน",
                  `แก้ไขคำอธิบายเกี่ยวกับแอปพลิเคชัน ${data?.topic}`
                );
                // ***********************
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

  return (
    <div className="learningcontent-edit">
      {imageFull}
      <form onSubmit={onSubmitManual}>
        <div className="editcontent-topic manual-topic-edit">
          <input
            ref={topic}
            type="text"
            name=""
            placeholder="หัวข้อ"
            defaultValue={data?.topic}
            required
          />
          <i
            className="bx bx-trash delete-icon manual-delete-icon"
            onClick={() => {
              deleteManual(index);
            }}
          ></i>
        </div>

        <div className="moodedit-topic">รูปภาพ</div>
        {allImageShow}
        <div className="moodedit-addimg">
          <label
            className="addimg"
            onClick={() => document.getElementById("input-img-content").click()}
          >
            เพิ่มรูปภาพ
          </label>
          <input
            className="show-none"
            type="file"
            name="filenameimg"
            id="input-img-content"
            accept="image/x-png,image/gif,image/jpeg"
            onChange={addImageContent}
          />
        </div>
        <div className="moodedit-topic moodedit-description">คำอธิบาย</div>
        <textarea ref={description} cols="30" rows="5"></textarea>
        <button type="submit">ตกลง</button>
      </form>

      <p id="updateAt-show">อัปเดตล่าสุดเมื่อ {getDateTime(data?.updateAt)}</p>
    </div>
  );
}

export default AboutItem;
