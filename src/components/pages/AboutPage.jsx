import React from "react";
import AboutHero from "../ui/AboutHero";
import BeaconAcronynm from "../ui/BeaconAcronynm";
import CoreValues from "../ui/CoreValues";
import MissionVision from "../ui/MissionVision";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <AboutHero />
        <MissionVision />
        <BeaconAcronynm />
        <CoreValues />
      </main>
      <Footer />
    </>
  );
}
