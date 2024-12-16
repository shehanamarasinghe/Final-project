import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
} from "@material-tailwind/react";

function AdminMealPlanRequestsModal({ isOpen, onClose }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (isOpen) fetchRequests();
  }, [isOpen]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("pending-notifications/meal-plan-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleRequestAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `pending-notifications/meal-plan-requests/${id}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // Refresh the list after action
    } catch (error) {
      console.error(`Error updating request status to ${action}:`, error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      className="fixed top-0 right-0 w-full max-w-sm max-h-[calc(100vh-5rem)] overflow-y-auto shadow-lg bg-white"
>
      <DialogHeader>
        <Typography variant="h6" color="blue-gray" className="text-center">
          Notifications...!
        </Typography>
      </DialogHeader>
      <DialogBody
        divider
        className="max-h-[calc(100vh-20rem)] overflow-y-auto px-4 py-2"
      >
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <h3 className="text-md font-bold text-gray-700">
                  {request.Firstname} {request.Lastname}
                </h3>
                <p className="text-gray-600">{request.request_message}</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleRequestAction(request.id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography className="text-center text-gray-600">
            No pending requests.
          </Typography>
        )}
      </DialogBody>
    </Dialog>
  );
}

export default AdminMealPlanRequestsModal;
