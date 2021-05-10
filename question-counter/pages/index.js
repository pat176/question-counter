import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
const d = new Date();
export default function Home() {
  const [state, setstate] = useState({ count: 0, recordArr: [] });
  useEffect(() => {
    console.log(d.toLocaleDateString());
    if (!localStorage.getItem("date")) {
      localStorage.setItem("date", d.toLocaleDateString());
    }
    if (!localStorage.getItem("records")) {
      let arr = [];
      localStorage.setItem("records", JSON.stringify(arr));
    }
    if (JSON.parse(localStorage.getItem("date")) != d.toLocaleDateString()) {
      console.log("here   ......");
      localStorage.setItem("date", JSON.stringify(d.toLocaleDateString()));
      const rec = [...localStorage.getItem("records")];
      rec.push(localStorage.getItem("count"));
      console.log(rec);
      localStorage.setItem("records", JSON.stringify(rec));
      console.log("here");
      localStorage.setItem("count", 0);
      console.log("heheheheheheh");
    }
    setstate({
      count: parseInt(localStorage.getItem("count")),
      recordArr: [...JSON.parse(localStorage.getItem("records"))],
    });
  }, []);
  const stateCounter = () => {
    console.log("clicked");
    setstate({ ...state, count: state.count + 1 });
    localStorage.setItem("count", state.count + 1);
    console.log(state.recordArr);
    console.log(localStorage.getItem("count"));
  };
  const stateCounterSub = () => {
    if (state.count != 0) {
      console.log("clicked");
      setstate({ ...state, count: state.count - 1 });
      localStorage.setItem("count", state.count - 1);
      console.log(state.recordArr);
      console.log(localStorage.getItem("count"));
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Question Counter</title>
      </Head>
      <div className={styles.container}>
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
          <span className={styles.prev}>Previous Days</span>
          {state.recordArr.reverse().map((element, index) => {
            return (
              <div className={styles.records} key={index + element}>
                {element}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
