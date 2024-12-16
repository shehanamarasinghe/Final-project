import React, { useRef } from 'react'
import './Mail.css'
import emailjs from '@emailjs/browser'

const Mail = () => {
  const form = useRef()
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_l76ig07', 'template_7dvqo0n', form.current, 'Cg5TJSposbQamwQu5')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }; 
  return (
    <div className="mail" id = "mail-us">
      <div className="left-m">
        <div>
          <span className='strock-text'>READY TO </span>
          <span>LEVEL UP</span>
        </div>
        <div>
          <span>YOUR BODY</span>
          <span className='strock-text'> WITH US?</span>
        </div>
      </div>
      <div className="right-m">
        <form ref={form} className='email-container' onSubmit={sendEmail}>
          <input type='email' name='user_email' placeholder='Enter Your email address'/>
        <button className='btnM'>Join Now</button>
        </form>
      </div>
    </div>
  )
}

export default Mail
