import React from 'react'
import './Home.css';
import Head from '../../Components/HomeComponent/Header/Head';
import Program from '../../Components/HomeComponent/Programs/Program';
import Reasons from '../../Components/HomeComponent/Reasons/Reasons';
import Plans from '../../Components/HomeComponent/Plan/Plans';
import Testimonials from '../../Components/HomeComponent/Testimonials/Testimonials';
import Mail from '../../Components/HomeComponent/Mail/Mail';
import Footer from '../../Components/HomeComponent/Footer/Footer';
import BmiCal from '../../Components/HomeComponent/BmiCal/BmiCal';

const Home = () => {
  return (
  
    <div className="Home">
    <Head/>
    <Program/>
    <Reasons/>
    <Plans/>
    <BmiCal/>
    <Testimonials/>
    <Mail/>
    <Footer/>
  

    </div>
  )
}

export default Home
