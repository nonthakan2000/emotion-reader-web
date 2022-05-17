
import "../css/EditProfile.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { database } from "../firebase";
import { ref as refDB, child, get, set } from "firebase/database";

import {
  ref as refSR,
  uploadBytesResumable,
  getDownloadURL,
} from "@firebase/storage";
import { storage } from "../firebase";

import Swal from "sweetalert2";

function EditProfile(props) {
  const { currentAuth } = props;
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState({});
  const firstname = useRef("");
  const lastname = useRef("");
  const phone = useRef("");

  useEffect(() => {
    if (!!currentAuth) {
      const dbRef = refDB(database);
      get(child(dbRef, `Admin/${currentAuth?.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const dataAdmin = snapshot.val();
            firstname.current.value = dataAdmin.fname ? dataAdmin.fname : "";
            lastname.current.value = dataAdmin.lname ? dataAdmin.lname : "";
            phone.current.value = dataAdmin.phone ? dataAdmin.phone : "";
            setAdminData(dataAdmin);
          }
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
  }, [currentAuth]);

  async function handleEditProfile(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const image = event.target[0].files[0];

      if (image) {
        uploadImage(image);
        return;
      }

      const newData = {
        fname: firstname.current.value,
        lname: lastname.current.value,
        phone: phone.current.value,
      };

      try {
        set(refDB(database, `Admin/${currentAuth?.uid}/fname`), newData.fname)
          .then(() => {
            set(
              refDB(database, `Admin/${currentAuth?.uid}/lname`),
              newData.lname
            )
              .then(() => {
                set(
                  refDB(database, `Admin/${currentAuth?.uid}/phone`),
                  newData.phone
                )
                  .then(() => {
                    Swal.fire({
                      title: "แก้ข้อมูลส่วนตัวสำเร็จ",
                      icon: "success",
                      confirmButtonText: "ตกลง",
                    });
                    document.getElementById("backToProfile").click();
                  })
                  .catch((error) => {
                    if (error) {
                      Swal.fire({
                        title: "แก้ข้อมูลส่วนตัวไม่สำเร็จ",
                        text: "กรุณาทำรายการใหม่อีกครั้ง",
                        icon: "error",
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
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ทำรายการไม่สำเร็จ",
          text: "กรุณาทำรายการใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
        });
      }
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ทำรายการไม่สำเร็จ",
        text: "กรุณาทำรายการใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    }
  }

  function uploadImage(image) {
    if (!image) return false;
    const storageRef = refSR(storage, `/image-profile/admin/${currentAuth.uid}.png`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => alert(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          try {
            const newData = {
              fname: firstname.current.value,
              lname: lastname.current.value,
              phone: phone.current.value,
              image: url,
            };

            try {
              set(
                refDB(database, `Admin/${currentAuth?.uid}/fname`),
                newData.fname
              )
                .then(() => {
                  set(
                    refDB(database, `Admin/${currentAuth?.uid}/lname`),
                    newData.lname
                  )
                    .then(() => {
                      set(
                        refDB(database, `Admin/${currentAuth?.uid}/phone`),
                        newData.phone
                      )
                        .then(() => {
                          set(
                            refDB(database, `Admin/${currentAuth?.uid}/image`),
                            newData.image
                          )
                            .then(() => {
                              Swal.fire({
                                title: "แก้ข้อมูลส่วนตัวสำเร็จ",
                                icon: "success",
                                confirmButtonText: "ตกลง",
                              });
                              document.getElementById("backToProfile").click();
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

            setLoading(false);
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

  function onChangeImage(event) {
    event.preventDefault();
    const image = document.getElementById("input-new-image").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      let profileImage = document.getElementById("img-edit-profile");
      profileImage.src = e.target.result;
    };
    reader.readAsDataURL(image);
  }

  return (
    <section className="container">
      <div className="text">แก้ไขข้อมูลส่วนตัว</div>
      <div className="editprofile">
        <form onSubmit={handleEditProfile}>
          <div
            className="imgeditprofile"
            onClick={() => {
              document.getElementById("input-new-image").click();
            }}
          >
            <i
              id="icon-change-image"
              className="bx bx-image-add icon-editprofile"
            ></i>
            <img
              id="img-edit-profile"
              src={
                adminData.image ? adminData.image : "/img/no-image-profile.png"
              }
              alt=""
            />
          </div>
          <input
            id="input-new-image"
            className="show-none"
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            onChange={onChangeImage}
          />
          <div className="editprofile-data">
            <div className="editprofile-box">
              <div className="editprofile-title">
                <p>ชื่อ :</p>
              </div>
              <div className="editprofile-input-box">
                <div className="editprofile-input nameedit">
                  <input
                    ref={firstname}
                    type="text"
                    name="firstname"
                    placeholder="ชื่อ"
                    required
                  />
                </div>
                <div className="editprofile-input nameedit">
                  <input
                    ref={lastname}
                    type="text"
                    name="lastname"
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="editprofile-box">
              <div className="editprofile-title">
                <p>เบอร์โทรศัพท์ :</p>
              </div>
              <div className="editprofile-input edit">
                <input
                  ref={phone}
                  type="tel"
                  placeholder="เบอร์โทรศัพท์"
                  pattern="0[1-9][0-9]{8}"
                  required
                />
              </div>
            </div>
            <div className="editprofile-box">
              <div className="editprofile-title">
                <p>อีเมล :</p>
              </div>
              <div className="editprofile-input edit">
                <input
                  id="input-editprofile-email"
                  type="email"
                  value={currentAuth?.email ? currentAuth?.email : "-"}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="button-editprofile">
            <div className="back-editprofile">
              <Link id="backToProfile" to="/profile">
                ย้อนกลับ
              </Link>
            </div>
            <div className="confirm-editprofile">
              <input type="submit" value="ตกลง" disabled={loading} />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditProfile;
