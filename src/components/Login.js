import "../css/Login.css";

import { signIn, forgotPassword } from "../firebase";
import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Swal from "sweetalert2";


function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  async function handleSignIn(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await signIn(emailRef.current.value, passwordRef.current.value);
      history.push("/overview");
      sessionStorage.setItem("toggleNav", "close");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          Swal.fire({
            title: "ไม่มีบัญชีดังกล่าว",
            text: "กรุณาใส่อีเมลใหม่อีกครั้ง",
            icon: "warning",
            confirmButtonText: "ตกลง",
          });
          break;
        case "auth/wrong-password":
          Swal.fire({
            title: "รหัสผ่านไม่ถูกต้อง",
            text: "กรุณาใส่รหัสผ่านใหม่อีกครั้ง",
            icon: "warning",
            confirmButtonText: "ตกลง",
          });
          break;
        default:
          alert(error);
      }
    }
    setLoading(false);
  }

  async function sendForgotPassword() {
    const email = emailRef.current.value;
    if (email === "") {
      Swal.fire({
        text: "กรุณาระบุอีเมล",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
    } else {
      try {
        await forgotPassword(email).then(() => {
          emailRef.current.value = "";
          // alert(`ระบบได้ส่งลิงค์การรีเซ็ตระรัสผ่านไปที่ ${email} กรุณาตรวบสอบอีเมล`);
          Swal.fire({
            text: `ระบบได้ส่งลิงค์การรีเซ็ตระรัสผ่านไปที่ ${email} กรุณาตรวบสอบอีเมล`,
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        });
      } catch (error) {
        alert(error);
      }
    }
  }

  return (
    <>
      <div className="login-box">
        <div className="login-img">
          <img src="/img/img-login.jpg" alt="" />
        </div>
        <div className="login-box2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/725/725107.png"
              alt=""
            />
          <h1>Emotion Reader</h1>
          <h3>Administrator</h3>
          <div className="login-input">
            <form onSubmit={handleSignIn}>
              <input
                ref={emailRef}
                type="email"
                name=""
                placeholder="อีเมล"
                required
              />
              <br />
              <input
                ref={passwordRef}
                type="password"
                name=""
                placeholder="รหัสผ่าน"
                required
              />
              <br />
              <div className="forgotpass">
                <Link to="#" onClick={sendForgotPassword}>
                  ลืมรหัสผ่าน
                </Link>
              </div>
              <button type="submit" disabled={loading}>
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
