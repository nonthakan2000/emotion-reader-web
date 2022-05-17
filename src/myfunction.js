import axios from "axios";
import { database } from "./firebase";
import { ref as refDB, set } from "firebase/database";

export function getDateTime(timestamp) {
  let date = new Date(timestamp);
  let dateTime =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();
  return dateTime;
}

export function getKeyHistory(timestamp) {
  let date = new Date(timestamp);
  let key = date.getMonth() + "-" + date.getFullYear();
  let day = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours.toString().length === 1) {
    hours = `0${hours}`;
  }
  if (minutes.toString().length === 1) {
    minutes = `0${minutes}`;
  }
  let time = `${hours}:${minutes}`;
  let dataKeyHistory = {
    key: key,
    day: day,
    time: time,
  };
  return dataKeyHistory;
}

export async function getIpAddress() {
  const res = await axios.get("https://geolocation-db.com/json/");
  const ipAddress = res.data.IPv4;

  return ipAddress;
}

export async function addHistory(uid, email, usage, description) {
  const timestamp = Date.now();
  const dataKeyHistory = getKeyHistory(timestamp);
  const ipAddress = await getIpAddress();
  await set(refDB(database, `History/${dataKeyHistory.key}/${timestamp}`), {
    uid: uid,
    email: email,
    usage: usage,
    ipAddress: ipAddress,
    description: description,
    createAt: timestamp,
  });
  return true;
}
