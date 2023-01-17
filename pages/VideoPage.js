import { useEffect, useState, useRef } from "react";
import { isServer } from "next/config";
import styles from "../styles/index.module.css";

const VideoPage = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await fetch("/api/video");
      const data = await response.json();
      // 將影片 src 設置到 state
      setVideoSrc(data.src);

      // 如果為客戶端，則將影片 src 存入 LocalStorage
      if (!isServer) {
        localStorage.setItem("videoSrc", data.src);
        localStorage.setItem("videoSrcMaxAge", Date.now() + 3600 * 1000);
      }
    };

    // 如果 LocalStorage 中沒有影片 src 或已過期，則 fetch
    if (
      !localStorage.getItem("videoSrc") ||
      Date.now() > localStorage.getItem("videoSrcMaxAge")
    ) {
      fetchVideo();
    } else {
      setVideoSrc(localStorage.getItem("videoSrc"));
    }
  }, []);

  useEffect(() => {
    // 建立 IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      // const entry = entries[0];
      entries.forEach((entry) => {
        // 如果影片出現在畫面中，則播放影片
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      });
    });
    // 監控影片元素
    observer.observe(videoRef.current);
    // 在元件卸載時，關閉 IntersectionObserver
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <video
        className={styles.video}
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        poster="../images/video-placeholder@desktop.png"
      />
    </>
  );
};

export default VideoPage;
