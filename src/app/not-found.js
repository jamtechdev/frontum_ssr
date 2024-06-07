"use client";
import { aboutUsService } from "@/_services";
import axios from "axios";
import React, { useEffect, useState } from "react";

const NotFound = () => {
  const [notDataFound, setNotDataFound] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/page-not-found`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      })
      .then((response) => {
        // Handle the response data here
        setNotDataFound(response.data?.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error(error);
      });
  }, []);

  // (notDataFound);

  return <div className="text-center py-5">{notDataFound?.text}</div>;
};

export default NotFound;
