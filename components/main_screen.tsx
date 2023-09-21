import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { detect, detectVideo } from "../utils/detect";
import Webcam from "react-webcam";

export default function MainScreen() {
  const [isClicked, setClick] = useState(false);
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState<{
    net: any;
    inputShape: any;
  }>({
    net: null,
    inputShape: [1, 0, 0, 3],
  });
  const cameraRef: any = useRef(null);
  const canvasRef: any = useRef(null);

  const modelName = "drowsy";
  useEffect(() => {
    console.log(cameraRef);
  }, [isClicked]);
  useEffect(() => {
    tf.ready().then(async () => {
      const yolov8: any = await tf.loadGraphModel(
        `${window.location.href}/${modelName}_web_model/model.json`,
        {
          onProgress: (fractions) => {
            setLoading({ loading: true, progress: fractions });
          },
        }
      ); // load model
      // warming up model
      const dummyInput: any = tf.ones(yolov8.inputs[0].shape);
      const warmupResults = await yolov8.execute(dummyInput);

      setLoading({ loading: false, progress: 1 });
      setModel({
        net: yolov8,
        inputShape: yolov8.inputs[0].shape,
      }); // set model & input shape

      tf.dispose([warmupResults, dummyInput]); // cleanup memory
    });
  }, []);

  return (
    <>
      <div className="flex justify-center h-screen items-center align-middle">
        <div className="flex flex-col">
          <div className="justyfy-center align-middle items-center">
            {loading.loading ? (
              <span>
                Loading model... {(loading.progress * 100).toFixed(2)}%
              </span>
            ) : (
              <div className="flex flex-col items-center justify-center gap-10">
                {isClicked && (
                  <div>
                    <canvas
                      width={model.inputShape[1]}
                      height={model.inputShape[2]}
                      className="shadow-2xl absolute top-0 pt-56"
                      ref={canvasRef}
                    />
                    <video
                      autoPlay
                      ref={cameraRef}
                      height={640}
                      onPlay={() => {
                        detectVideo(
                          cameraRef.current,
                          model,
                          canvasRef.current
                        );
                      }}
                      className="shadow-2xl"
                    />
                  </div>
                )}

                <div
                  className="btn hover:shadow-lg hover:btn-error"
                  onClick={() => {
                    if (isClicked) {
                      //close
                      cameraRef.current.srcObject
                        .getTracks()
                        .forEach((track: any) => {
                          track.stop();
                        });
                      cameraRef.current.srcObject = null;
                    } else {
                      //open
                      const getWebcam = async () => {
                        try {
                          const stream =
                            await navigator.mediaDevices.getUserMedia({
                              audio: false,
                              video: {
                                facingMode: "environment",
                              },
                            });
                          cameraRef.current.srcObject = stream;
                        } catch (err) {
                          console.log(err);
                        }
                      };
                      getWebcam();
                    }

                    setClick(!isClicked);
                  }}
                >
                  {isClicked ? "Stop Camera" : "Start Camera"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
