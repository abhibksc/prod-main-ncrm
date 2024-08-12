import React, { useState } from "react";

export default function TestChild() {
  const [myName, setMyname] = useState("vijay");
  return (
    <div>
      <p className=" text-3xl text-white">Tset child</p>
    </div>
  );
}
