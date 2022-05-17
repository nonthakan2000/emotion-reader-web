
import { signIn, changePassword } from "../firebase";
import "../css/ChangePassword.css";
import { Link } from "react-router-dom";
import { useRef } from "react";

import Swal from "sweetalert2";

function ChangePassword(props) {
  const { currentAuth } = props;
  const passwordOld = useRef("");
  const passwordNew = useRef("");
  const passwordConfirm = useRef("");

  async function handleChangePassword(event) {
    event.preventDefault();
    if (passwordNew.current.value !== passwordConfirm.current.value) {
      Swal.fire({
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาใส่รหัสผ่านใหม่และยืนยันรหัสผ่านอีกครั้ง",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    try {
      await signIn(currentAuth.email, passwordOld.current.value);
      await changePassword(passwordNew.current.value);
      Swal.fire({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      document.getElementById("backToProfile").click();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          Swal.fire({
            title: "รหัสผ่านเดิมไม่ถูกต้อง",
            text: "กรุณาใส่รหัสผ่านเดิมอีกครั้ง",
            icon: "warning",
            confirmButtonText: "ตกลง",
          });
          break;
        default:
          Swal.fire({
            icon: "error",
            title: "ทำรายการไม่สำเร็จ",
            text: "กรุณาทำรายการใหม่อีกครั้ง",
            confirmButtonText: "ตกลง",
          });
      }
    }
  }

  return (
    <section className="container">
      <div className="text">แก้ไขรหัสผ่าน</div>
      <div className="changepass">
      <img
          src="https://cdn-icons-png.flaticon.com/512/3039/3039427.png"
          alt=""
        />
        <form onSubmit={handleChangePassword}>
          <div className="changepass-box">
            <div className="change-box">
              <div className="change-title">
                <p>รหัสผ่านเดิม :</p>
              </div>
              <div className="change-input">
                <input
                  ref={passwordOld}
                  className="inputbox"
                  type="password"
                  minLength="6"
                  required
                />
              </div>
            </div>
            <div className="change-box">
              <div className="change-title">
                <p>รหัสผ่านใหม่ :</p>
              </div>
              <div className="change-input">
                <input
                  ref={passwordNew}
                  className="inputbox"
                  type="password"
                  minLength="6"
                  required
                />
              </div>
            </div>
            <div className="change-box">
              <div className="change-title">
                <p>ยืนยันรหัสผ่านใหม่ :</p>
              </div>
              <div className="change-input">
                <input
                  ref={passwordConfirm}
                  className="inputbox"
                  type="password"
                  minLength="6"
                  required
                />
              </div>
            </div>
          </div>
          <div className="button-changepass">
            <div className="back-changepass">
              <Link id="backToProfile" to="/profile">
                ย้อนกลับ
              </Link>
            </div>
            <div className="confirm-changepass">
              <input type="submit" value="ตกลง" />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ChangePassword;
