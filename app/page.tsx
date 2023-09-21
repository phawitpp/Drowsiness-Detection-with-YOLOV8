"use client";
import { useState, useEffect } from "react";
import MainScreen from "@/components/main_screen";
export default function Home() {
  const [isClicked, setClick] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden my-10"
          >
            Menu
          </label>
          <MainScreen />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col justify-around">
            <div className="flex flex-col justify-center items-center py-10">
              <a className="text-2xl font-bold">Drowsy Detection</a>
              <a className="text-lg font-semibold">with YOLOV8</a>
              <a className="text-lg">ALPHA VERSION</a>
            </div>
            <div className="flex flex-col justify-center items-center">
              <li>
                <a>
                  <span className="text-xl">Main</span>
                </a>
              </li>
              <li>
                <span className="text-xl">Setting</span>
              </li>
              <li>
                <span className="text-xl"> </span>
              </li>
            </div>

            <div className="flex flex-col justify-center items-center py-10 mt-96">
              <span>Last Updated</span>
              <span className="text-lg">
                {/* {date.toLocaleDateString() + " " + date.toLocaleTimeString()} */}
              </span>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
