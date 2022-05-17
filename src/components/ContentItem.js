import { useAuth } from "../firebase";
import { useEffect, useRef, useState } from "react";
import { database, storage } from "../firebase";
import { getDateTime, addHistory } from "../myfunction";
import { ref as refDB, set, child, get, remove } from "firebase/database";
import {
  ref as refSR,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "@firebase/storage";

import Swal from "sweetalert2";

function ContentItem(props) {
  const currentAuth = useAuth();
  const { eid, emotional, setEditContent, setEmotional } = props;
  const images = emotional.images ? emotional?.images : {};
  const [allImageShow, setAllImageShow] = useState(
    <div id="all-image-contents" />
  );
  const [fullImage, setFullImage] = useState(null);

  const description = useRef("");

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
        const desertRef = refSR(storage, `/image-content/${key}`);
        // Delete the Image
        deleteObject(desertRef)
          .then(() => {
            remove(refDB(database, `Contents/${eid}/images/${key}`))
              .then(() => {
                const dbRef = refDB(database);
                get(child(dbRef, `Contents/`))
                  .then((snapshot) => {
                    let allEmotional = {};
                    let emotionNew = {};
                    if (snapshot.exists()) {
                      allEmotional = snapshot.val();
                      emotionNew = allEmotional[eid];
                    }
                    setEmotional(allEmotional);
                    setEditContent(
                      <ContentItem
                        eid={eid}
                        emotional={emotionNew}
                        setEditContent={setEditContent}
                        setEmotional={setEmotional}
                      />
                    );

                    // add history
                    addHistory(
                      currentAuth.uid,
                      currentAuth.email,
                      "ลบรูปภาพเนื้อหา",
                      `ลบรูปภาพเนื้อหาของอารมณ์${emotional.emotion}`
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
                // The write failed...
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
    Object.keys(images).forEach(
      (key) => {
        allListImage.push({
          key: key,
          image: images[key],
        });
      },
      [emotional]
    );
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
    description.current.value = emotional.description
      ? emotional.description
      : "";
    getShowImage();
  }, [emotional]);

  function addImageContent(event) {
    event.preventDefault();
    const imageContent = document.getElementById("input-img-content").files[0];
    if (!imageContent) {
      return;
    }
    const timestamp = Date.now();

    const storageRef = refSR(storage, `/image-content/${timestamp}`);
    const uploadTask = uploadBytesResumable(storageRef, imageContent);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => alert(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          try {
            set(refDB(database, `Contents/${eid}/images/${timestamp}`), url)
              .then(() => {
                const dbRef = refDB(database);
                get(child(dbRef, `Contents/`))
                  .then((snapshot) => {
                    let allEmotional = {};
                    let emotionNew = {};
                    if (snapshot.exists()) {
                      allEmotional = snapshot.val();
                      emotionNew = allEmotional[eid];
                    }
                    setEmotional(allEmotional);
                    setEditContent(
                      <ContentItem
                        eid={eid}
                        emotional={emotionNew}
                        setEditContent={setEditContent}
                        setEmotional={setEmotional}
                      />
                    );

                    // add history
                    addHistory(
                      currentAuth.uid,
                      currentAuth.email,
                      "เพิ่มรูปภาพเนื้อหา",
                      `เพิ่มรูปภาพเนื้อหาของอารมณ์${emotional.emotion}`
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
            Swal.fire({
              icon: "error",
              title: "ทำรายการไม่สำเร็จ",
              text: "กรุณาทำรายการใหม่อีกครั้ง",
              confirmButtonText: "ตกลง",
            });
          }
        });
      }
    );
  }

  function submitNewContent(event) {
    event.preventDefault();
    const newDescription = description.current.value;
    const timestamp = Date.now();
    try {
      set(refDB(database, `Contents/${eid}/description`), newDescription)
        .then(() => {
          set(refDB(database, `Contents/${eid}/updateAt`), timestamp)
            .then(() => {
              Swal.fire({
                title: "บันทึกข้อมูลสำเร็จ",
                icon: "success",
                button: "ตกลง",
              });
            })
            .catch((error) => {
              if (error) {
                Swal.fire({
                  title: "บันทึกข้อมูลไม่สำเร็จ",
                  text: "กรุณาทำรายการใหม่อีกครั้ง",
                  icon: "error",
                  confirmButtonText: "ตกลง",
                });
              }
            });

          // add history
          addHistory(
            currentAuth.uid,
            currentAuth.email,
            "แก้ไขเนื้อหา",
            `แก้ไขเนื้อหาของอารมณ์${emotional.emotion}`
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
      let dateTime = getDateTime(timestamp);
      document.getElementById("updateAt-show").innerHTML =
        "อัปเดตล่าสุดเมื่อ " + dateTime;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ทำรายการไม่สำเร็จ",
        text: "กรุณาทำรายการใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    }
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
      <span className="mood-edit">
        {emotional.emotion ? emotional?.emotion : "-"}
      </span>
      <form onSubmit={submitNewContent}>
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
        <textarea
          ref={description}
          cols="30"
          rows="5"
          defaultValue={emotional.description ? emotional.description : ""}
        ></textarea>
        <button type="submit">ตกลง</button>
      </form>

      <p id="updateAt-show">
        อัปเดตล่าสุดเมื่อ{" "}
        {emotional.updateAt ? getDateTime(emotional.updateAt) : "-"}
      </p>
    </div>
  );
}

export default ContentItem;
