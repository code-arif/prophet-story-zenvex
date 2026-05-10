import React, { useEffect, useState } from "react";

export default function QiblaCompass({ qiblaDirection }) {

  const [heading, setHeading] = useState(null);
  const [supported, setSupported] = useState(false);

  // Initialize compass
  useEffect(() => {

    const handleOrientation = (event) => {

      let compass = null;

      // iOS
      if (event.webkitCompassHeading) {
        compass = event.webkitCompassHeading;
      }

      // Android
      else if (event.alpha !== null) {
        compass = 360 - event.alpha;
      }

      if (compass !== null) {
        setHeading(compass);
      }

    };

    const initCompass = async () => {

      if (typeof DeviceOrientationEvent === "undefined") return;

      // iOS permission
      if (typeof DeviceOrientationEvent.requestPermission === "function") {

        try {

          const permission = await DeviceOrientationEvent.requestPermission();

          if (permission === "granted") {

            setSupported(true);
            window.addEventListener("deviceorientation", handleOrientation, true);

          }

        } catch (err) {
          console.log(err);
        }

      }

      // Android
      else {

        setSupported(true);
        window.addEventListener("deviceorientation", handleOrientation, true);

      }

    };

    // require user click for iOS
    const clickInit = () => {
      initCompass();
      document.removeEventListener("click", clickInit);
    };

    document.addEventListener("click", clickInit);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      document.removeEventListener("click", clickInit);
    };

  }, []);

  // calculate relative qibla
  const relativeQibla =
    heading !== null && qiblaDirection
      ? qiblaDirection - heading
      : 0;

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="relative w-56 h-56">

        {/* Compass circle */}
        <div className="absolute inset-0 rounded-full bg-white shadow-xl ring-4 ring-emerald-500">

          {/* North */}
          <div className="absolute inset-0 flex items-start justify-center pt-3">
            <span className="font-bold text-red-600 text-lg">N</span>
          </div>

          {/* East */}
          <div className="absolute inset-0 flex items-center justify-end pr-4">
            <span className="text-gray-600 font-bold">E</span>
          </div>

          {/* South */}
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <span className="text-gray-600 font-bold">S</span>
          </div>

          {/* West */}
          <div className="absolute inset-0 flex items-center justify-start pl-4">
            <span className="text-gray-600 font-bold">W</span>
          </div>

        </div>

        {/* Qibla arrow */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
          style={{
            transform: `rotate(${relativeQibla}deg)`
          }}
        >

          {/* Kaaba */}
          <div className="relative flex flex-col items-center">

            <div className="w-10 h-10 bg-black rounded-md border border-yellow-500 shadow-xl flex items-center justify-center">
              <div className="w-3 h-5 border border-yellow-400 rounded-sm"></div>
            </div>

            {/* Arrow */}
            <div className="mt-1 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-emerald-600"></div>

          </div>

        </div>

        {/* center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
        </div>

      </div>

      {/* Heading info */}
      {heading !== null && (
        <div className="text-sm text-gray-600">
          Device Heading: <b>{heading.toFixed(0)}°</b>
        </div>
      )}

      {!supported && (
        <div className="text-sm text-gray-500">
          Tap screen to enable compass
        </div>
      )}

    </div>
  );
}