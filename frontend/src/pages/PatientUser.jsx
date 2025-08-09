import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Play, Pause, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import NavBar from '../components/NavBar';

const PatientProfile = () => {
  const { username } = useParams();
  // const navigate = useNavigate(); // Removed because it's unused
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [graphData, setGraphData] = useState([]);

  // Mock data for recordings - replace with actual API data
  const mockRecordings = [
    { id: 1, chapter: 1, word: "apple", date: "2023-05-10", accuracy: 75, url: "/recordings/1" },
    { id: 2, chapter: 1, word: "banana", date: "2023-05-12", accuracy: 82, url: "/recordings/2" },
    { id: 3, chapter: 2, word: "cat", date: "2023-05-15", accuracy: 68, url: "/recordings/3" },
  ];


 
  // Mock data for graph - replace with actual API data
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
      } finally {
        setLoading(false);
      }
    };
    fetchPatientProfile();
  }, [username, timeRange, mockGraphData]);

  useEffect(() => {
    // Update graph when time range changes
    setGraphData(mockGraphData[timeRange]);
  }, [timeRange, mockGraphData]);

  const handlePlayRecording = (recording) => {
    setCurrentRecording(recording);
    setIsPlaying(true);
    // Here you would implement actual audio playback
    console.log("Playing recording:", recording.url);
  };

  const handleDownload = (recording) => {
    console.log("Downloading recording:", recording.url);
    // Implement download functionality
  };

  const handleChapterChange = (direction) => {
    if (direction === 'prev' && currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (direction === 'next' && currentChapter < 10) { // Assuming 10 chapters
      setCurrentChapter(currentChapter + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        No profile found for this patient.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Patient Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-custom-blue">
          <h1 className="text-3xl font-bold text-custom-blue mb-4">Patient Profile</h1>
          
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

        {/* Recordings and Graph Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recordings List */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-custom-blue">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Chapter {currentChapter} Recordings</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleChapterChange('prev')}
                  className="p-2 rounded-full bg-custom-blue text-white hover:bg-blue-700 transition"
                  disabled={currentChapter === 1}
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  onClick={() => handleChapterChange('next')}
                  className="p-2 rounded-full bg-custom-blue text-white hover:bg-blue-700 transition"
                  disabled={currentChapter === 10}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {mockRecordings
                .filter(rec => rec.chapter === currentChapter)
                .map(recording => (
                  <div key={recording.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{recording.word}</h3>
                        <p className="text-sm text-gray-500">{recording.date}</p>
                        <p className="text-sm">
                          Accuracy: <span className="font-medium">{recording.accuracy}%</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handlePlayRecording(recording)}
                          className="p-2 rounded-full bg-custom-blue text-white hover:bg-blue-700 transition"
                        >
                          {isPlaying && currentRecording?.id === recording.id ? <Pause size={18} /> : <Play size={18} />}
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
                ))}
            </div>
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