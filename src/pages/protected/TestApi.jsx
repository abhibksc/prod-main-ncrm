import axios from "axios";
import React from "react";

export default function TestApi() {
  const testHandler = async () => {
    const res = await axios.post(`https://trapi.jarha.in/demo1/Adduser`, {
      Manager_Index: 102,
      MT5Account: "62876",
      Name: "apiTest",
      Leverage: "100",
      Group_Name: "contest.Offer2",
    });
    console.log(res.data);
  };
  //   hello world
  return (
    <div className=" h-screen w-full bg-black text-white">
      <button onClick={testHandler} className=" bg-yellow-700  p-10">
        API test
      </button>
    </div>
  );
}
