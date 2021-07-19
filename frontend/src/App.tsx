import React, { useRef, useState } from "react";
import * as R from "ramda";
import produce from "immer";
import "./App.css";
import { nanoid } from "nanoid";
import { stat } from "node:fs";

function generateTest(baseDelay = 2000) {
  return function runTest() {
    const delay = baseDelay + Math.random() * baseDelay;
    const testPassed = Math.random() > 0.5;
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(testPassed);
      }, delay);
    });
  };
}

type status = {
  status: "Idle" | "Running" | "Success" | "Failure" | "Stopped";
  id?: string;
};

type run = {
  cancelled: boolean;
};

function App() {
  const [statuses, setStatuses] = useState<status[]>(
    new Array(10).fill({ status: "Idle" })
  );
  const tests = useRef(
    new Array(10).fill(undefined).map((x) => generateTest())
  );
  const runs = useRef<Record<string, run>>({});

  const runTest = async (test: () => Promise<unknown>, i: number) => {
    const myId = nanoid();
    runs.current[myId] = { cancelled: false };

    setStatuses((prev) =>
      produce(prev, (next) => {
        next[i] = { status: "Running", id: myId };
      })
    );
    const result = await test();

    const cancelled = (() => runs.current[myId].cancelled)();
    if (!cancelled) {
      setStatuses((prev) =>
        produce(prev, (next) => {
          next[i].status = result ? "Success" : "Failure";
        })
      );
    }
  };

  const runTests = () => {
    tests.current.forEach(runTest);
  };

  const regenerateAndRunTest = (i: number) => async () => {
    const test = generateTest();
    tests.current[i] = test;

    const myId = nanoid();
    runs.current[myId] = { cancelled: false };

    setStatuses((prev) =>
      produce(prev, (next) => {
        next[i] = { status: "Running", id: myId };
      })
    );
    const result = await test();

    const cancelled = (() => runs.current[myId].cancelled)();
    if (!cancelled) {
      setStatuses((prev) =>
        produce(prev, (next) => {
          next[i].status = result ? "Success" : "Failure";
        })
      );
    }
  };

  const stopTests = () => {
    statuses.forEach((status, i) => {
      if (status.status === "Running") {
        runs.current[status.id!] = { cancelled: true };
        setStatuses((prev) =>
          produce(prev, (next) => {
            next[i].status = "Stopped";
          })
        );
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {statuses.map((status, i) => (
          <div key={i}>
            {status.status}
            {["Stopped", "Failure"].includes(status.status) && (
              <button onClick={regenerateAndRunTest(i)}>RUN ME</button>
            )}
          </div>
        ))}
        <button onClick={runTests}>RUN</button>
        <button onClick={stopTests}>STOP</button>
      </header>
    </div>
  );
}

export default App;
