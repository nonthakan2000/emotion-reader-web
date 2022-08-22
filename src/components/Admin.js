import "../css/Admin.css";
import { addAdmin, database, signIn } from "../firebase";
import { ref as refDB, set, child, get } from "firebase/database";
import { getDateTime, addHistory } from "../myfunction";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Admin(props) {
  const { currentAuth } = props;
  const [allAdmin, setAllAdmin] = useState([]);
  const [filter, setFilter] = useState("");

  async function addAdminNew() {
    try {
      Swal.fire({
        title: "กรุณาใส่อีเมลที่คุณต้องการเพิ่ม",
        input: "email",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        validationMessage: "อีเมลไม่ถูกต้อง",
      }).then((result) => {
        if (result.isConfirmed) {
          let email = result.value;
          const timestamp = Date.now();
          const key = btoa(timestamp);
          addAdmin(email, key).then(() => {
            try {
              set(refDB(database, `InviteAdmin/${key}`), {
                email: email,
                status: false,
                createAt: timestamp,
              })
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    text: `ระบบได้ส่งลิงค์การเป็นแอดมินไปที่ ${email} กรุณาตรวบสอบอีเมล`,
                    confirmButtonText: "ตกลง",
                  });
                  // add history
                  addHistory(
                    currentAuth?.uid,
                    currentAuth?.email,
                    "เพิ่มผู้ดูแลระบบ",
                    `เพิ่ม ${email} เป็นผู้ดูแลระบบ`
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
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ทำรายการไม่สำเร็จ",
        text: "กรุณาทำรายการใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    }
  }

  async function getAllAdmin() {
    const dbRef = refDB(database);
    get(child(dbRef, "Admin/"))
      .then((snapshot) => {
        let allAdmins = {};
        if (snapshot.exists()) {
          allAdmins = snapshot.val();
        }
        try {
          let arrAdmin = [];
          Object.keys(allAdmins).forEach((key) => {
            const value = allAdmins[key];
            if (value.status) {
              let dateTime = getDateTime(value.createAt);
              let admin = {
                key: key,
                email: value.email,
                fname: value.fname,
                lname: value.lname,
                image: value.image,
                phone: value.phone,
                date: dateTime,
                position: value.position,
              };
              arrAdmin.push(admin);
            }
          });

          arrAdmin.forEach(function (admin, i) {
            if (admin.key === currentAuth?.uid) {
              arrAdmin.splice(i, 1);
              arrAdmin.unshift(admin);
            }
          });
          setAllAdmin(arrAdmin);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "ทำรายการไม่สำเร็จ",
            text: "กรุณาทำรายการใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
          });
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

  useEffect(() => {
    getAllAdmin();
  }, []);

  function deleteAdmin(uid, email) {
    if (uid !== currentAuth?.uid) {
      Swal.fire({
        title: "ยืนยันการลบผู้ดูแลระบบ",
        text: "กรุณาใสรหัสผ่านของคุณ",
        input: "password",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          let password = result.value;
          signIn(currentAuth?.email, password)
            .then(() => {
              set(refDB(database, `Admin/${uid}/status`), false)
                .then(() => {
                  Swal.fire({
                    title: "ลบสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                  });
                  getAllAdmin();

                  // add history
                  addHistory(
                    currentAuth?.uid,
                    currentAuth?.email,
                    "ลบผู้ดูแลระบบ",
                    `ลบ ${email} ออกจากการเป็นผู้ดูแลระบบ`
                  );
                  // ***********************
                })
                .catch((error) => {
                  if (error) {
                    Swal.fire({
                      title: "ลบไม่สำเร็จ",
                      icon: "error",
                      confirmButtonText: "ตกลง",
                    });
                  }
                  Swal.showValidationMessage("เกิดข้อผิดพลาดบางอย่าง !");
                });
            })
            .catch((error) => {
              if (error) {
                Swal.fire({
                  title: "ลบไม่สำเร็จ",
                  icon: "error",
                  confirmButtonText: "ตกลง",
                });
              }
              Swal.showValidationMessage("รหัสผ่านไม่ถูกต้อง !");
            });
        }
      });
    }
  }

  const adminElements = allAdmin
    .filter((admin) => {
      try {
        return (
          admin.fname.toLowerCase().includes(filter.toLowerCase()) ||
          admin.lname.toLowerCase().includes(filter.toLowerCase()) ||
          admin.email.toLowerCase().includes(filter.toLowerCase()) ||
          admin.phone.toLowerCase().includes(filter.toLowerCase())
        );
      } catch (error) {}
    })
    .map((admin) => {
      return (
        <li key={admin.key} className="admin-card">
          {admin.position === "owner" ? (
            ""
          ) : (
            <i
              className="bx bx-trash trash-admin"
              onClick={() => {
                deleteAdmin(admin.key, admin.email);
              }}
            ></i>
          )}
          <div className="admin-imgbox">
            <img
              className="admin-img"
              src={admin.image ? admin.image : "/img/no-image-profile.png"}
              alt=""
            />
          </div>
          <div className="admin-info">
            <h3 className="admin-name">
              {admin.fname} {admin.lname}
            </h3>
            <br />
            <h5 className="admin-email">{admin.position}</h5>
            <br />
            <h5 className="admin-email">{admin.email}</h5>
            <br />
            <h5 className="admin-email">{admin.phone}</h5>

            <br />
            <p className="admin-email">{admin.date}</p>
          </div>
        </li>
      );
    });

  return (
    <section className="container">
      <div className="text mb-20">ผู้ดูแลระบบ</div>
      <div className="adminpage">
        <div className="addmin-add-box two">
          <button className="add-admin" onClick={addAdminNew}>
            เพิ่มผู้ดูแลระบบ
          </button>
        </div>
        <div className="adminpage-bar">
          <div className="search">
            <div className="search-admin">
              <input
                type="search"
                name="filter"
                placeholder="ค้นหาผู้ดูแลระบบ"
                value={filter}
                onChange={(even) => {
                  setFilter(even.target.value);
                }}
              />
            </div>
          </div>
          <div className="addmin-add-box">
            <button className="add-admin" onClick={addAdminNew}>
              เพิ่มผู้ดูแลระบบ
            </button>
          </div>
        </div>
        <div className="adminpage-box">
          <div className="admin-list">
            <ul id="list-admin-elements">{adminElements}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;
