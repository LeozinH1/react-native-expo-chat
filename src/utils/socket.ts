import { connect } from "socket.io-client";

const socket = connect("http://192.168.1.8:3000");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("connect_error", (err: any) => {
  // console.log(err.message);
});

export default socket;
