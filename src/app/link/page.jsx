"use client";
import React from "react";
import { redirect } from 'next/navigation'
export default async function Page({ searchParams }) {
    if (!searchParams?.p) {
      redirect('/')
    }

  if(typeof window !== 'undefined'){
      let link = atob(searchParams?.p);
      window.location = link
  }
  return (
    <React.Suspense fallback={<p>Loading....</p>}>
    </React.Suspense>
  );
}
