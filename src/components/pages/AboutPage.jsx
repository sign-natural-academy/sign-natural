import React from 'react'
import AboutHero from '../AboutHero'
import MissionVision from '../MissionVision'
import CoreValalues from '../CoreValues'
import BeaconAcronynm from '../BeaconAcronynm'
import Navbar from '../Navbar'
import { Footer } from '../Footer'

export default function AboutPage() {
  return (
    <div> 
        
        <Navbar/>
        <AboutHero/>
        <MissionVision/>
        <CoreValalues/>
        <BeaconAcronynm/>
        <Footer/>
    </div>
  )
}

