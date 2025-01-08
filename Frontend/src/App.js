//import React, { useContext } from 'react';
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login.jsx"
import Register from "./Pages/Register/Register.jsx"
import MDashboard from "./Pages/MDashBoard/MDashboard.jsx"
import ADashboard from "./Pages/ADashboard/ADashboard.jsx"
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import AddReminder from "./Components/MDashboardComponents/Reminder/AddReminder.jsx";
import AMealPlan from "./Pages/MealPlan/MealShedule.jsx";
import MemberMeal from "./Pages/MealPlan/MemberMeal.jsx";
import Memberworkout from "./Pages/WorkoutPlan/Memberworkout.jsx";
import Adminreminder from "./Pages/Reminder/AdminReminder.jsx"
import Users from "./Pages/ADashboard/Users.jsx";
import ReminderPage from "./Pages/Reminder/ReminderPage.jsx";
import PrivateRoute from './Context/PrivateRoute.js';
import ExerciseManagement from './Pages/WorkoutPlan/Adminworkout/ExerciseManagement.jsx';
import WorkoutPlanManagement from './Pages/WorkoutPlan/Adminworkout/WorkoutPlanManagement.jsx';
import Memberassignedplans from './Pages/MealM/Memberassignedplans.jsx';
import Notification from './Components/AdminNotifications/Notifications.jsx';
import MemberNotifications from './Pages/Notificationsmember/Notificationmember.jsx';
import ProfileEdit from './Pages/ProfileEdit/ProfileEdit.jsx';
import Adminpayment from './Pages/Payments/Adminpayment.jsx';
import MemberPayment from './Pages/Payments/MemberPayment.jsx';
import Assignworkout from './Pages/WorkoutPlan/Adminworkout/Assignworkout.jsx';
import AFeedback from './Pages/AFeedbacks/Adminfeedback.jsx';
import MemberPaymentDashboard from "./Pages/Payments/MemberPaymentDashboard.jsx";
import AdminPaymentDashboard from "./Pages/Payments/AdminpaymentDashboard.jsx";

  


function App() {

  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/"element = {<Home/>} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/AddReminder" element={<AddReminder/>} />
      <Route path="/AMealPlan" element={<AMealPlan/>}/>
      <Route path="/MemberMeal" element={<MemberMeal/>}/>
      <Route path="/Adminreminder" element={<Adminreminder/>}/>
      <Route path="/Memberworkout" element={<Memberworkout/>}/>
      <Route path="/ReminderPage" element={< ReminderPage/>}/>
      <Route path="/Users" element={<Users/>}/>
      <Route path="/ExerciseManagement" element={<ExerciseManagement />} />
      <Route path="/workout-plans" element={<WorkoutPlanManagement />} />
      <Route path="/memberassignedplans" element={<Memberassignedplans />} />
      <Route path="/Notification" element={<Notification />} />
      <Route path="/MemberNotifications" element={<MemberNotifications />} />
      <Route path="/ProfileEdit" element={<ProfileEdit />} />
      <Route path="/Adminpayment" element={<Adminpayment />} />
      <Route path="/MemberPayment" element={<MemberPayment />} />
      <Route path="/Assignworkout" element={<Assignworkout />} />
      <Route path="/AFeedback" element={<AFeedback />} />
      <Route path="/MemberPaymentDashboard" element={<MemberPaymentDashboard />} />
      <Route path="/AdminPaymentDashboard" element={<AdminPaymentDashboard />} />
      

      <Route 
        path="/ADashboard" 
        element={
          <PrivateRoute isAdminRoute={true}>
            <ADashboard />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/Mdashboard" 
        element={
          <PrivateRoute isAdminRoute={false}>
            <MDashboard />
          </PrivateRoute>
        }
      />
     
    </Routes>
    </BrowserRouter>

    
  );
}

export default App;
