import "../css/AddAdmin.css";
import { Link, Redirect, Route, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { database, signUp, storage, signIn } from "../firebase";
import { ref as refDB, child, get, set } from "firebase/database";
import {
  ref as refSR,
  uploadBytesResumable,
  getDownloadURL,
} from "@firebase/storage";

import { Switch } from "react-router-dom";

import Swal from "sweetalert2";

function AddAdmin(props) {
  const { currentAuth } = props;
  const { key } = useParams();
  const [showFrom, setShowFrom] = useState("");

  const email = useRef("");
  const fname = useRef("");
  const lname = useRef("");
  const phone = useRef("");
  const pass = useRef("");
  const conpass = useRef("");

  async function submitFrom(event) {
    event.preventDefault();

    if (pass.current.value !== conpass.current.value) {
      Swal.fire({
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาใส่รหัสผ่านใหม่และยืนยันรหัสผ่านอีกครั้ง",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    const emails = email.current.value;
    const password = pass.current.value;
    const image = event.target[0].files[0];
    const timestamp = Date.now();

    let adminNew = {
      createAt: timestamp,
      fname: fname.current.value,
      lname: lname.current.value,
      phone: phone.current.value,
      email: emails,
      position: "admin",
      status: true,
    };

    try {
      await signUp(emails, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;
          if (image) {
            set(refDB(database, `Admin/${uid}`), adminNew)
              .then(() => {
                set(refDB(database, `InviteAdmin/${key}/status`), true)
                  .then(() => {
                    const storageRef = refSR(
                      storage,
                      `/image-profile/admin/${uid}.png`
                    );
                    const uploadTask = uploadBytesResumable(storageRef, image);
                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {},
                      (err) => alert(err),
                      () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                          adminNew.image = url;
                          set(refDB(database, `Admin/${uid}`), adminNew)
                            .then(() => {
                              Swal.fire({
                                title: "สมัครผู้ดูแลระบบสำเร็จสำเร็จ",
                                icon: "success",
                                confirmButtonText: "ตกลง",
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
                        });
                      }
                    );
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
          } else {
            set(refDB(database, `Admin/${uid}`), adminNew)
              .then(() => {
                set(refDB(database, `InviteAdmin/${key}/status`), true)
                  .then(() => {
                    Swal.fire({
                      title: "สมัครผู้ดูแลระบบสำเร็จ",
                      icon: "success",
                      confirmButtonText: "ตกลง",
                    });
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
                Swal.fire({
                  icon: "error",
                  title: "ทำรายการไม่สำเร็จ",
                  text: "กรุณาทำรายการใหม่อีกครั้ง",
                  confirmButtonText: "ตกลง",
                });
              });
          }
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/weak-password":
              alert("Password should be at least 6 characters !");
              break;
            case "auth/email-already-in-use":
              Swal.fire({
                title: "คุณมีบัญชีผู้ใช้อยู่แล้ว",
                text: "กรุณากรอกรหัสผ่านของคุณ เพื่อดำเนินการต่อ",
                input: "password",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
              }).then((result) => {
                if (result.isConfirmed) {
                  let passwordInput = result.value;
                  signIn(emails, passwordInput)
                    .then((userCredential) => {
                      const user = userCredential.user;
                      const uid = user.uid;
                      if (image) {
                        set(refDB(database, `Admin/${uid}`), adminNew)
                          .then(() => {
                            set(
                              refDB(database, `InviteAdmin/${key}/status`),
                              true
                            )
                              .then(() => {
                                const storageRef = refSR(
                                  storage,
                                  `/image-profile/admin/${uid}.png`
                                );
                                const uploadTask = uploadBytesResumable(
                                  storageRef,
                                  image
                                );
                                uploadTask.on(
                                  "state_changed",
                                  (snapshot) => {},
                                  (err) => alert(err),
                                  () => {
                                    getDownloadURL(
                                      uploadTask.snapshot.ref
                                    ).then((url) => {
                                      adminNew.image = url;
                                      set(
                                        refDB(database, `Admin/${uid}`),
                                        adminNew
                                      )
                                        .then(() => {
                                          Swal.fire({
                                            title: "สมัครแอดมินสำเร็จ",
                                            icon: "success",
                                            confirmButtonText: "ตกลง",
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
                                    });
                                  }
                                );
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
                      } else {
                        set(refDB(database, `Admin/${uid}`), adminNew)
                          .then(() => {
                            set(
                              refDB(database, `InviteAdmin/${key}/status`),
                              true
                            )
                              .then(() => {
                                Swal.fire({
                                  title: "สมัครแอดมินสำเร็จ",
                                  icon: "success",
                                  confirmButtonText: "ตกลง",
                                });
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
                            Swal.fire({
                              icon: "error",
                              title: "ทำรายการไม่สำเร็จ",
                              text: "กรุณาทำรายการใหม่อีกครั้ง",
                              confirmButtonText: "ตกลง",
                            });
                          });
                      }
                    })
                    .catch((error) => {
                      if (error) {
                        Swal.fire({
                          title: "รหัสผ่านไม่ถูกต้อง",
                          icon: "error",
                          confirmButtonText: "ตกลง",
                        });
                      }
                      Swal.showValidationMessage(
                        "กรุณาตรวจสอบรหัสผ่านอีกครั้ง !"
                      );
                    });
                }
              });
              break;
            default:
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

  function onChangeImage(event) {
    event.preventDefault();
    const image = document.getElementById("image-add-admin").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      let profileImage = document.getElementById("image-add-admin-show");
      profileImage.src = e.target.result;
    };
    reader.readAsDataURL(image);
  }

  function getInviteAdmin() {
    try {
      if (!!key) {
        const dbRef = refDB(database);
        get(child(dbRef, `InviteAdmin/${key}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              if (!data.status && currentAuth?.email !== data.email) {
                setShowFrom(
                  <div className="newadmin">
                    <div>
                      <img
                        className="logo-newadmin"
                        src="https://cdn-icons-png.flaticon.com/512/725/725107.png"
                        alt=""
                      />
                      <div className="title-name">สวัสดี</div>
                      <div className="title-text">
                        ขอต้อนรับเข้าสู่ EmotionReader
                      </div>
                      <div className="newadmin-box">
                        <div className="text">จัดการข้อมูล</div>
                        <form onSubmit={submitFrom}>
                          <img
                            id="image-add-admin-show"
                            className="newadmin-img"
                            src="/img/no-image-profile.png"
                            alt=""
                            onClick={() => {
                              document
                                .getElementById("image-add-admin")
                                .click();
                            }}
                          />
                          <input
                            id="image-add-admin"
                            className="show-none"
                            name="image-add-admin"
                            type="file"
                            accept="image/x-png,image/gif,image/jpeg"
                            onChange={onChangeImage}
                          />
                          <div className="newadmin-inputbox">
                            <input
                              ref={fname}
                              name="fname"
                              type="text"
                              className="input-newadmin"
                              placeholder="ชื่อ"
                              required
                            />
                            <input
                              ref={lname}
                              name="lname"
                              type="text"
                              className="input-newadmin"
                              placeholder="นามสกุล"
                              required
                            />
                          </div>
                          <input
                            ref={phone}
                            name="phone"
                            type="tel"
                            className="input-newadmin"
                            placeholder="เบอร์โทร"
                            pattern="0[1-9][0-9]{8}"
                            required
                          />
                          <br />
                          <input
                            ref={email}
                            name="email"
                            type="email"
                            className="input-newadmin"
                            disabled
                            required
                          />
                          <br />
                          <input
                            ref={pass}
                            name="pass"
                            type="password"
                            className="input-newadmin"
                            placeholder="รหัสผ่านใหม่"
                            required
                          />
                          <br />
                          <input
                            ref={conpass}
                            name="conpass"
                            type="password"
                            className="input-newadmin"
                            placeholder="ยืนยันรหัสผ่านใหม่"
                            required
                          />
                          <br />
                          <button type="submit">ยืนยัน</button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
                email.current.value = data?.email;
              } else {
                setShowFrom(
                  <div className="newadmin">
                    <div>
                      <img
                        className="logo-newadmin"
                        src="https://cdn-icons-png.flaticon.com/512/725/725107.png"
                        alt=""
                      />
                      <div className="title-name">สวัสดี</div>
                      <div className="title-text">
                        ขอต้อนรับเข้าสู่ EmotionReader
                      </div>

                      <Link to="/">ไปที่หน้าเว็บ</Link>
                    </div>
                  </div>
                );
              }
            } else {
              setShowFrom(
                <Switch>
                  <Route path="*">
                    <Redirect to="/page404" />
                  </Route>
                </Switch>
              );
            }
          })
          .catch((error) => {});
      }
    } catch (error) {}
  }

  useEffect(() => {
    getInviteAdmin();
    if (!!currentAuth) {
      document.getElementById("navigatione-sidebar").classList.add("show-none");
    }
  }, [currentAuth]);

  return <>{showFrom}</>;
}

export default AddAdmin;
