<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
<<<<<<< HEAD
import { Play, Pause, Download } from 'lucide-react';
=======
import { Play, Pause, Download, ArrowLeft, ArrowRight } from 'lucide-react';
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
import NavBar from '../components/NavBar';

const PatientProfile = () => {
  const { username } = useParams();
<<<<<<< HEAD
=======
  // const navigate = useNavigate(); // Removed because it's unused
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Modal & email states
  const [modalOpen, setModalOpen] = useState(false);
  const [emailToSend, setEmailToSend] = useState('');
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const audioRef = useRef(null);

<<<<<<< HEAD
=======
 
  // Mock data for graph - replace with actual API data
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
  const mockGraphData = React.useMemo(() => ({
    monthly: [
      { name: 'Week 1', accuracy: 65 },
      { name: 'Week 2', accuracy: 75 },
      { name: 'Week 3', accuracy: 82 },
      { name: 'Week 4', accuracy: 78 },
    ],
    weekly: [
      { name: 'Mon', accuracy: 70 },
      { name: 'Tue', accuracy: 75 },
      { name: 'Wed', accuracy: 80 },
      { name: 'Thu', accuracy: 72 },
      { name: 'Fri', accuracy: 85 },
    ],
    yearly: [
      { name: 'Jan', accuracy: 65 },
      { name: 'Feb', accuracy: 70 },
      { name: 'Mar', accuracy: 75 },
      { name: 'Apr', accuracy: 80 },
      { name: 'May', accuracy: 82 },
    ]
  }), []);

  useEffect(() => {
<<<<<<< HEAD
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(
          `http://127.0.0.1:8000/api/patient-profile/${username}/`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('access_Token')}` } }
        );
        setProfile(profileResponse.data);

        const recordingsResponse = await axios.get(
          `http://127.0.0.1:8000/api/doctor/patient-recordings/${username}/`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('access_Token')}` } }
        );
        setRecordings(recordingsResponse.data);
        setGraphData(mockGraphData[timeRange]);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
=======
    const fetchPatientProfile = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`http://127.0.0.1:8000/api/patient-profile/${username}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_Token')}`,//not standerdized access token
          },
        });
        setProfile(response.data);
        // Set initial graph data
        setGraphData(mockGraphData[timeRange]);
      } catch (error) {
        setError('Failed to fetch patient profile');
        console.error('Error fetching profile:', error);
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

    fetchData();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
=======
    fetchPatientProfile();
>>>>>>> 25bbeaea32f89c467b1258f821d604b4e48deaa6
  }, [username, timeRange, mockGraphData]);

  useEffect(() => {
    setGraphData(mockGraphData[timeRange]);
  }, [timeRange, mockGraphData]);

  const handlePlayRecording = (recording) => {
    if (currentRecording?.id === recording.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);
    setCurrentRecording(recording);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(recording.recording_file);
    audioRef.current = audio;

    audio.onplay = () => {
      setIsPlaying(true);
      setIsLoadingAudio(false);
    };

    audio.onerror = () => {
      setIsLoadingAudio(false);
      setIsPlaying(false);
      alert('Failed to play recording. Please try downloading it instead.');
    };

    audio.onended = () => {
      setIsPlaying(false);
      setIsLoadingAudio(false);
    };

    audio.play().catch(e => {
      console.error('Playback failed:', e);
      setIsLoadingAudio(false);
      alert('Playback failed. Please check the recording URL.');
    });
  };

  const handleDownload = (recording) => {
    const url = recording.recording_file;
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send Credentials Handler
  const handleSendCredentials = async () => {
    if (!emailToSend) {
      setErrorMessage('Please enter an email.');
      return;
    }

    setSending(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/patients/${username}/send-credentials/`,
        { email: emailToSend },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_Token')}` } }
      );

      setSuccessMessage(response.data.success);
      setEmailToSend('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || 'Failed to send credentials');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-blue"></div></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!profile) return <div className="flex justify-center items-center h-screen">No profile found for this patient.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        {/* Patient Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-custom-blue relative">
          <h1 className="text-3xl font-bold text-custom-blue mb-4">Patient Profile</h1>

          {/* Send Credentials Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Credentials
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Username:</span> {profile.username}</p>
                <p><span className="font-medium">Gender:</span> {profile.patient_data?.gender || 'N/A'}</p>
                <p><span className="font-medium">Age:</span> {profile.patient_data?.age || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Address:</span> {profile.patient_data?.address || 'N/A'}</p>
                <p><span className="font-medium">Emergency Contact:</span> {profile.patient_data?.emergency_contact || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Credentials Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 relative">
              <h2 className="text-lg font-semibold mb-4">Send Login Credentials</h2>
              
              <input
                type="email"
                placeholder="Enter patient email"
                value={emailToSend}
                onChange={(e) => setEmailToSend(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
              />

              {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
              {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendCredentials}
                  disabled={sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recordings and Graph Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recordings List */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-custom-blue">
            <h2 className="text-xl font-semibold mb-6">Patient Recordings</h2>

            {recordings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No recordings found for this patient</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {recordings.map(recording => {
                  const date = new Date(recording.created_at);
                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  return (
                    <div key={recording.id} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Recording {recording.id}</h3>
                          <p className="text-sm text-gray-500">{formattedDate}</p>
                          <p className="text-sm">
                            Duration: <span className="font-medium">{recording.duration} seconds</span>
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handlePlayRecording(recording)}
                            className="p-2 rounded-full bg-custom-blue text-white hover:bg-blue-700 transition"
                            disabled={isLoadingAudio}
                          >
                            {isLoadingAudio && currentRecording?.id === recording.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            ) : (
                              isPlaying && currentRecording?.id === recording.id ? <Pause size={18} /> : <Play size={18} />
                            )}
                          </button>
                          <button 
                            onClick={() => handleDownload(recording)}
                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress Graph */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-custom-blue">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Pronunciation Progress</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange('weekly')}
                  className={`px-3 py-1 rounded-lg ${timeRange === 'weekly' ? 'bg-custom-blue text-white' : 'bg-gray-200'} transition`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-3 py-1 rounded-lg ${timeRange === 'monthly' ? 'bg-custom-blue text-white' : 'bg-gray-200'} transition`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeRange('yearly')}
                  className={`px-3 py-1 rounded-lg ${timeRange === 'yearly' ? 'bg-custom-blue text-white' : 'bg-gray-200'} transition`}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D9D9" />
                  <XAxis dataKey="name" stroke="#333" />
                  <YAxis stroke="#333" domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Accuracy']}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#26046B"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: "#26046B", strokeWidth: 2, fill: "#26046B" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Medical History */}
        {profile.patient_data?.medical_history && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8 border-2 border-custom-blue">
            <h2 className="text-xl font-semibold mb-4">Medical History</h2>
            <p className="whitespace-pre-line">{profile.patient_data.medical_history}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
