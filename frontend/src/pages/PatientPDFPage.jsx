import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import NavBar from '../components/NavBar';
import bgImage from '../assets/left-container.jpg';

const PatientPDFPage = () => {
  const { username } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided in URL.');
      setLoading(false);
      return;
    }
    // Use the correct backend endpoint for patient profile by username
    fetch(`http://127.0.0.1:8000/api/patient-profile/${encodeURIComponent(username)}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_Token')}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(`Status: ${res.status} - ${res.statusText}\nResponse: ${text.substring(0, 200)}`);
        }
        try {
          const data = JSON.parse(text);
          return data;
        } catch (jsonErr) {
          throw new Error(`Invalid JSON. Status: ${res.status}\nResponse: ${text.substring(0, 200)}`);
        }
      })
      .then((data) => {
        setPatient(data.patient_data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);

  const generatePDF = () => {
    if (!patient) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Patient Registration Details', 10, 20);
    doc.setFontSize(12);
    let y = 40;
    Object.entries(patient).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    });
    doc.save('patient_registration.pdf');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No patient data found.</div>;

  return (
    <>
      <NavBar />
      <div className="w-full bg-no-repeat bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-black bg-opacity-50 px-4 py-10">
          <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-8">
            <h2 className="text-2xl font-bold text-custom-blue text-center mb-6 tracking-wide">Patient Registration Details</h2>
            <table className="w-full border-separate border-spacing-y-2 mb-6">
              <tbody>
                {Object.entries(patient).map(([key, value]) => (
                  <tr key={key}>
                    <td className="font-semibold text-gray-700 capitalize w-2/5 bg-gray-50 px-4 py-2 rounded-l-lg">{key.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 text-gray-900 rounded-r-lg break-words">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center">
              <button
                onClick={generatePDF}
                className="bg-custom-blue text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-white hover:text-custom-blue border border-custom-blue transition"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientPDFPage;
