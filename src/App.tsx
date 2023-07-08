import React from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import flyImage from "./assets/fruit-fly-g491a21229_640.png";
import "./App.css";
import { Box } from "@mui/material";

class Fly {
  private img: HTMLImageElement;
  private isImageReady = false;
  private startX: number;
  private startY: number;
  private x: number;
  private y: number;
  private targetX: number;
  private targetY: number;

  constructor(canvas: HTMLCanvasElement) {
    this.img = document.createElement("img");

    this.img.onload = () => {
      this.isImageReady = true;
    };

    this.img.src = flyImage;

    this.startX = Math.random() * canvas.width;
    this.startY = Math.random() * canvas.height;
    this.x = this.startX;
    this.y = this.startY;
    this.targetX = this.x;
    this.targetY = this.y;
  }

  public frame(
    timeStamp: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    if (
      Math.abs(this.targetX - this.x) < 1 &&
      Math.abs(this.targetY - this.y) < 1
    ) {
      this.startX = this.targetX;
      this.startY = this.targetY;
      this.targetX = Math.random() * canvas.width;
      this.targetY = Math.random() * canvas.height;
    }

    this.x += ((this.targetX - this.startX) / 2) * (timeStamp / 1000);
    this.y += ((this.targetY - this.startY) / 2) * (timeStamp / 1000);

    if (this.isImageReady) {
      ctx.drawImage(this.img, this.x, this.y, 50, 50);
    }
  }
}

function App() {
  // const [count, setCount] = useState(0);
  const canvasRef = React.createRef<HTMLCanvasElement>();

  // const element = document.getElementById("some-element-you-want-to-animate");
  let start: number | undefined;
  let previousTimeStamp: number | undefined;
  // let done = false;

  const flys: Fly[] = [];

  const step: FrameRequestCallback = (timeStamp) => {
    if (start === undefined) {
      start = timeStamp;
    }
    if (previousTimeStamp === undefined) {
      previousTimeStamp = timeStamp;
    }
    // const elapsed = timeStamp - start;
    const relElapsed = timeStamp - previousTimeStamp;

    if (canvasRef.current !== null) {
      if (canvasRef.current.width !== canvasRef.current.clientWidth) {
        canvasRef.current.width = canvasRef.current.clientWidth;
      }
      if (canvasRef.current.height !== canvasRef.current.clientHeight) {
        canvasRef.current.height = canvasRef.current.clientHeight;
      }

      if (flys.length < 10 && Math.random() > 0.1) {
        flys.push(new Fly(canvasRef.current));
      }

      const ctx = canvasRef.current.getContext("2d");
      if (ctx != null) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        for (const fly of flys) {
          fly.frame(relElapsed, canvasRef.current, ctx);
        }
      }
    }

    // if (previousTimeStamp !== timeStamp) {
    //   // Math.min() is used here to make sure the element stops at exactly 200px
    //   const count = Math.min(0.1 * elapsed, 200);
    //   element.style.transform = `translateX(${count}px)`;
    //   if (count === 200) done = true;
    // }

    // if (elapsed < 10000) {
    previousTimeStamp = timeStamp;
    // if (!done) {
    window.requestAnimationFrame(step);
    // }
    // }
  };

  window.requestAnimationFrame(step);

  return (
    <Box>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "beige",
        }}
      />
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
          <img src={flyImage} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </Box>
  );
}

export default App;
