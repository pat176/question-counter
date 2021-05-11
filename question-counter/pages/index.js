import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
const d = new Date();

function roundNumber(num, scale) {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
      "e-" +
      scale
    );
  }
}

const sum = (arr) => {
  let out = 0;
  for (let i = 0; i < arr.length; i++) {
    out += arr[i][0];
  }
  return out;
};
const avgTime = (arr) => {
  let out = 0;
  for (let i = 0; i < arr.length; i++) {
    out += arr[i][1][2] / 60 + arr[i][1][1] + arr[i][1][0] * 60;
  }
  console.log("out = ", out);
  return sum(arr) / out;
};
export default function Home() {
  const [state, setstate] = useState({
    count: 0,
    recordArr: [],
    time: [0, 0, 0],
    isActive: false,
    isPaused: true,
  });
  useEffect(() => {
    // console.log(d.toLocaleDateString());
    if (!localStorage.getItem("date")) {
      localStorage.setItem("date", JSON.stringify(d.toLocaleDateString()));
    }
    if (!localStorage.getItem("time")) {
      localStorage.setItem("time", JSON.stringify([0, 0, 0]));
    }
    if (!localStorage.getItem("records")) {
      let arr = [];
      localStorage.setItem("records", JSON.stringify(arr));
    }
    if (
      localStorage.getItem("date") != JSON.stringify(d.toLocaleDateString())
    ) {
      // console.log("here   ......");
      localStorage.setItem("date", JSON.stringify(d.toLocaleDateString()));
      const rec = [...JSON.parse(localStorage.getItem("records"))];
      rec.push([
        JSON.parse(localStorage.getItem("count")),
        JSON.parse(localStorage.getItem("time")),
      ]);
      // console.log(rec);
      localStorage.setItem("records", JSON.stringify(rec));
      // console.log("here");
      localStorage.setItem("count", JSON.stringify(0));
      // console.log("heheheheheheh");
      localStorage.setItem("time", JSON.stingify([0, 0, 0]));
    }
    // console.log(typeof JSON.parse(localStorage.getItem("records")));
    setstate({
      count: parseInt(JSON.parse(localStorage.getItem("count"))),
      recordArr: [...JSON.parse(localStorage.getItem("records"))].reverse(),
      time: JSON.parse(localStorage.getItem("time")),
    });
  }, []);
  useEffect(() => {
    // console.log("in use effect");
    let interval = null;
    // console.log("hello");
    // console.log(state.isActive, state.isPaused);
    if (state.isActive === true) {
      // console.log("here");
      interval = setInterval(() => {
        let tmp = state.time;
        tmp[2] += 1;
        if (tmp[2] >= 60) {
          tmp[2] = 0;
          tmp[1] += 1;
          if (tmp[1] >= 60) {
            tmp[1] = 0;
            tmp[0] += 1;
          }
        }
        // console.log(tmp);
        // console.log("\n\n\n\n\n\nwee aaarreree heree \n\n\n\n\n\n\n\n");
        if (state.isActive === true) {
          setstate({
            ...state,
            time: tmp,
          });
          localStorage.setItem("time", JSON.stringify(tmp));
        }
      }, 1000);
    } else {
      // console.log("here");
      clearInterval(interval);
      console.log(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [state.isActive, state.isPaused]);
  const stateCounter = () => {
    // console.log("clicked");
    setstate({ ...state, count: state.count + 1 });
    localStorage.setItem("count", JSON.stringify(state.count + 1));
    // console.log(state.recordArr);
    // console.log(localStorage.getItem("count"));
  };
  const stateCounterSub = () => {
    if (state.count != 0) {
      // console.log("clicked");
      setstate({ ...state, count: state.count - 1 });
      localStorage.setItem("count", JSON.stringify(state.count - 1));
      // console.log(state.recordArr);
      // console.log(localStorage.getItem("count"));
    }
  };
  const playStopwatch = () => {
    setstate({
      ...state,
      isPaused: false,
      isActive: true,
    });
    // console.log("we are here");
  };
  const pauseStopwatch = () => {
    setstate({
      ...state,
      isPaused: true,
      isActive: false,
    });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Question Counter</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.prev}>
          Timer : {state.time[0] + ":" + state.time[1] + ":" + state.time[2]}
        </div>
        <button onClick={playStopwatch} className={styles.buttonSt}>
          Pl
        </button>
        <button onClick={pauseStopwatch} className={styles.buttonSt}>
          Sto
        </button>

        <div className={styles.count}>{state.count}</div>
        <div>
          <button onClick={stateCounter} className={styles.button}>
            +
          </button>
          <button onClick={stateCounterSub} className={styles.button}>
            -
          </button>
        </div>
        <div>
          <span className={styles.prev}>
            Previous Days | Total Questions Done = {sum(state.recordArr)} | Avg.
            Questions Per Day = {sum(state.recordArr) / state.recordArr.length}{" "}
            | Solving Speed ={" "}
            {roundNumber(avgTime(state.recordArr), 2) + " Ques/Min"}
          </span>
          {state.recordArr.map((element, index) => {
            return (
              <div className={styles.records} key={index + element[0]}>
                {element[0] +
                  " Questions   | Time Taken: " +
                  element[1][0] +
                  ":" +
                  element[1][1] +
                  ":" +
                  element[1][2]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
