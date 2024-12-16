import React, {useState} from 'react'
import './BmiCal.css'
import CalculateImage from "../../../Images/calculate-img.png"

const BmiCal = () => {

    const[weight,setWeight] = useState();
    const[height,setHeight] = useState();
    const[bmi,setBmi] = useState();
    const[msg,setmsg] = useState('');

    const handleCalculation = (e) =>{
        e.preventDefault()

        if(weight === 0 || height === 0){

            alert('Please Enter a Valid nuber')
        }
        else{
            let bmiFomular = (weight / (height * height)* 703);
            setBmi(bmiFomular.toFixed(2)) 
        }

        if(bmi < 25){
            setmsg("You're Underweight")
        }
        else if (bmi >= 25 || bmi <= 30){
            setmsg("You're healthy")

        }
        else{
            setmsg("You're unhealthy, please seek for medication")
        }

    }
    
  return (

 
  
    <div className='Container'>
        <div className="left-bm">
        <div className="calculate__container container grid">
            <div className="calculate__content">
                <div className="section__titles">
                    <h1 className="section__title-border">CLCULATE</h1>
                    <h1 className="section__title">YOUR BMI</h1>
                </div>
                <p className="calculate__description">
                    The body mass index (BMI) calculator calculates body mass
                    index from your weight and height
                </p>

                <form onSubmit={handleCalculation} className="calculate__form" >
                    <div className="calculate__box">
                        <input type="number" placeholder='Height' className="calculate__input" value={weight} onChange={(e)=> setWeight(e.target.value)} />
                        <lable for = "" className="calculate__lable">cm</lable>
                    </div>

                    <div className="calculate__box">
                        <input type="number" placeholder='Weight' className="calculate__input" value={height} onChange={(e)=> setHeight(e.target.value)} />
                        <lable for = "" className="calculate__lable">kg</lable>
                    </div>

                    <button type='submit' className="button button__flex">
                        Calculate Now
                    </button>
                </form>

                <p className="calculate__massage" id="caculate-massage">{msg}</p>
            </div>

            </div>  
        </div>
        <div className="right-bm">
        <img src={CalculateImage} alt="" className="calculate__img" />
        </div>

    </div>

  )
}

export default BmiCal
