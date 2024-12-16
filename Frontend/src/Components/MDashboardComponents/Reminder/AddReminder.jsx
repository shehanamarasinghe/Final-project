import React, { useRef } from 'react'
import './AddReminder.css'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';

const AddReminder = ({ onClose }) => {

  const AddRef = useRef();

  const closeAdd = (e) => {
    if(AddRef.current === e.target){
      onClose();
    }
  }


  
  return (
    <div ref={AddRef} onClick={closeAdd} className='Reminder-Main'>
      <div className="Reminder-head">
        <button onClick={onClose} className='addR-btn'><CloseRoundedIcon/></button>
        <div className='re-form' >
          <h1>Add Reminder</h1>
          <form>
            <div className='form-element'>
              <input type='text'
                     placeholder='Enter the Title'
                     required/>

              <input type='text'
                     placeholder='Enter the Discription'
                     required/>

              <input type='datetime-local'
                     required/>

              <button><AddTaskRoundedIcon className='rebuton'/>Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddReminder
