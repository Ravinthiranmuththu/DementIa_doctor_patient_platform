import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import bgImage from '../assets/left-container.jpg';
import { UserPlus, Search, UserMinus, UserCog, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
  });
  const [username, setUsername] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const apiUrl = 'http://127.0.0.1:8000/api/patients/';

  const openModal = (type) => setModalOpen(type);
  
  const closeModal = () => {
    setModalOpen(null);
    setForm({
      email: '',
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
    });
    setUsername('');
    setSelectedPatient(null);
  };

  const handleAdd = async () => {
    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      age: form.age,
      gender: form.gender,
      address: form.address,
      emergency_contact: form.emergencyContact,
      medical_history: form.medicalHistory,
    };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
        },
      });

      if (response.status === 201) {
        const { username, password } = response.data;
        alert(`Patient registered!\nUsername: ${username}\nPassword: ${password}`);
        closeModal();
      }
    } catch (error) {
      console.error('Error adding patient:', error.response?.data || error.message);
      alert(`Error adding patient: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const handleUpdate = async (patientId) => {
    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      age: form.age,
      gender: form.gender,
      address: form.address,
      emergency_contact: form.emergencyContact,
      medical_history: form.medicalHistory,
    };

    try {
      const response = await axios.put(`${apiUrl}${patientId}/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
        },
      });

      if (response.status === 200) {
        alert('Patient updated successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error updating patient:', error.response?.data || error.message);
      alert(`Error updating patient: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const handleDelete = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      // First find the patient by username
      const searchResponse = await axios.get(`${apiUrl}?username=${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
        },
      });

      if (searchResponse.data.length === 0) {
        alert('Patient not found');
        return;
      }

      const patientId = searchResponse.data[0].id;
      const deleteResponse = await axios.delete(`${apiUrl}${patientId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
        },
      });

      if (deleteResponse.status === 204) {
        alert('Patient deleted successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting patient:', error.response?.data || error.message);
      alert(`Error deleting patient: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const loadPatientForUpdate = async () => {
  if (!username.trim()) {
    alert('Please enter a username');
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}?username=${username}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
      },
    });
    
    if (response.data.length > 0) {
      const patient = response.data[0]; // Get first item from array
      setSelectedPatient(patient);
      setForm({
        firstName: patient.first_name || patient.user?.first_name || '',
        lastName: patient.last_name || patient.user?.last_name || '',
        email: patient.email || patient.user?.email || '',
        age: patient.age || '',
        gender: patient.gender || '',
        address: patient.address || '',
        emergencyContact: patient.emergency_contact || '',
        medicalHistory: patient.medical_history || '',
      });
    } else {
      alert('Patient not found');
    }
  } catch (error) {
    console.error('Error fetching patient:', error);
    alert(`Error fetching patient details: ${error.response?.data?.error || error.message}`);
  }
};

  return (
    <>
      <NavBar />
      <div className="w-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-black bg-opacity-50 px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Add', icon: <UserPlus />, type: 'Add' },
              { label: 'Search', icon: <Search />, type: 'Search' },
              { label: 'Update', icon: <UserCog />, type: 'Update' },
              { label: 'Remove', icon: <UserMinus />, type: 'Remove' },
            ].map(({ label, icon, type }) => (
              <button
                key={type}
                className="w-36 h-36 flex flex-col items-center justify-center rounded-xl bg-custom-blue text-white hover:bg-white hover:text-custom-blue transition text-base font-medium"
                onClick={() => openModal(type)}
              >
                <div className="w-8 h-8 mb-2">{icon}</div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={modalOpen === 'Add'} onClose={closeModal} title="Add Patient">
        {[
          { name: 'firstName', label: 'First Name' },
          { name: 'lastName', label: 'Last Name' },
          { name: 'email', label: 'Email' },
          { name: 'age', label: 'Age' },
          { name: 'address', label: 'Address' },
          { name: 'emergencyContact', label: 'Emergency Contact' },
          { name: 'medicalHistory', label: 'Medical History' },
        ].map(({ name, label }) => (
          <input
            key={name}
            placeholder={label}
            className="w-full border rounded-lg p-2"
            value={form[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          />
        ))}

        <select
          className="w-full border rounded-lg p-2"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button
          className="w-full bg-custom-blue text-white py-2 rounded-lg hover:bg-white hover:text-custom-blue border border-custom-blue transition"
          onClick={handleAdd}
        >
          Add Patient
        </button>
      </Modal>

      {/* Search Patient Modal */}
      <Modal isOpen={modalOpen === 'Search'} onClose={closeModal} title="View Patient Profile">
        <input
          placeholder="Enter Patient Username"
          className="w-full border rounded-lg p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-full bg-custom-blue text-white py-2 rounded-lg hover:bg-white hover:text-custom-blue border border-custom-blue transition"
          onClick={() => {
            if (username.trim()) {
              navigate(`/patient-profile/${username}`);
              closeModal();
            } else {
              alert('Please enter a username');
            }
          }}
        >
          View Profile
        </button>
      </Modal>

      {/* Update Patient Modal */}
      <Modal isOpen={modalOpen === 'Update'} onClose={closeModal} title="Update Patient">
        <input
          placeholder="Enter Patient Username"
          className="w-full border rounded-lg p-2 mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-3"
          onClick={loadPatientForUpdate}
        >
          Load Patient
        </button>

        {selectedPatient && (
          <>
            {[
              { name: 'firstName', label: 'First Name' },
              { name: 'lastName', label: 'Last Name' },
              { name: 'email', label: 'Email' },
              { name: 'age', label: 'Age' },
              { name: 'address', label: 'Address' },
              { name: 'emergencyContact', label: 'Emergency Contact' },
              { name: 'medicalHistory', label: 'Medical History' },
            ].map(({ name, label }) => (
              <input
                key={name}
                placeholder={label}
                className="w-full border rounded-lg p-2 mb-2"
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              />
            ))}

            <select
              className="w-full border rounded-lg p-2 mb-3"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              onClick={() => handleUpdate(selectedPatient.id)}
            >
              Update Patient
            </button>
          </>
        )}
      </Modal>

      {/* Delete Patient Modal */}
      <Modal isOpen={modalOpen === 'Remove'} onClose={closeModal} title="Delete Patient">
        <input
          placeholder="Enter Patient Username"
          className="w-full border rounded-lg p-2 mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete Patient
        </button>
      </Modal>
    </>
  );
};

export default Home;