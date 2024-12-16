import React, { useState, useEffect } from 'react';
import Sidebar from "../../Components/ADashboardComponents/SlideBar/Slidebar";
import Navbar from '../../Components/ADashboardComponents/Navbar/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function Users() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    handleViewMembers();
  }, []);

  const handleViewMembers = async () => {
    try {
      const res = await axios.get('/users/getuser');
      setMembers(res.data);
    } catch (err) {
      toast.error('Error fetching members');
      console.error(err);
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();

    if (!selectedMember.userid) {
      toast.error('User ID is missing, cannot update');
      return;
    }

    try {
      const res = await axios.put(`/users/update/${selectedMember.userid}`, selectedMember, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(res.data.message);
      setIsModalOpen(false);
      handleViewMembers();
    } catch (err) {
      toast.error('Error updating member');
      console.error(err);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedMember({ ...selectedMember, [name]: value });
  };

  const confirmDeleteMember = async () => {
    try {
      const res = await axios.delete(`/users/delete/${selectedMember.userid}`);
      toast.success(res.data.message);
      setIsDeleteModalOpen(false);
      handleViewMembers();
    } catch (err) {
      toast.error('Error deleting member');
      console.error(err);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.UserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='Adashboard'>
      <Sidebar />
      <div className="ADash-Container">
        <Navbar />
        <div className="datatable">
          <div className="container mx-auto p-4">
            <div className="mt-6">
              <input
                type="text"
                placeholder="Search members by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div key={member.userid} className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border p-4">
                    <div className="flex items-center">
                      <div>
                        <h6 className="font-sans text-base font-semibold leading-relaxed text-blue-gray-900">
                          {member.UserName}
                        </h6>
                        <p className="font-sans text-sm font-normal leading-normal text-gray-700">
                          {member.Email}
                        </p>
                        <p className="font-sans text-sm font-normal leading-normal text-gray-700">
                          {member.PhoneNo}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <FaEdit onClick={() => handleEditMember(member)} className="text-blue-500 cursor-pointer" />
                      <FaTrashAlt onClick={() => handleDeleteMember(member)} className="text-red-500 cursor-pointer" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-700">No members found</p>
              )}
            </div>

            {isModalOpen && selectedMember && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-semibold mb-4">Edit Member</h2>
                  <form onSubmit={handleUpdateMember}>
                    <div className="mb-4">
                      <label className="block text-gray-700">Name</label>
                      <input
                        type="text"
                        name="UserName"
                        value={selectedMember.UserName}
                        onChange={handleModalChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Email</label>
                      <input
                        type="email"
                        name="Email"
                        value={selectedMember.Email}
                        onChange={handleModalChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Phone</label>
                      <input
                        type="text"
                        name="PhoneNo"
                        value={selectedMember.PhoneNo}
                        onChange={handleModalChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#009688] text-white rounded-md">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 ml-2 bg-[#e91e63] text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {isDeleteModalOpen && selectedMember && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-semibold mb-4">Delete Member</h2>
                  <p>Are you sure you want to delete {selectedMember.UserName}?</p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={confirmDeleteMember}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2 ml-2 bg-gray-300 text-black rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
