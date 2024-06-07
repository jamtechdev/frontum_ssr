"use client";
import { Oval, RotatingLines } from "react-loader-spinner";

const Loader = ({ pageType }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Other content */}
      {/* <Circles
        type="TailSpin" // Specify the type of loader animation
        color="#00BFFF" // Specify the color of the loader
        height={50} // Specify the height of the loader
        width={50} // Specify the width of the loader
      /> */}

      {/* <Oval
        height={80}
        width={80}
        color="#"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
      /> */}
      {pageType === "comparison" ? (
        <RotatingLines
          height={80}
          width={80}
          strokeColor="#27304e"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#27304e"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <Oval
          height={80}
          width={80}
          color="#"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      )}

      {/* Other content */}
    </div>
  );
};

export default Loader;
