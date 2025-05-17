import React from 'react';
import { Mail, Phone, MapPin, Clock, Info } from 'lucide-react';

const InformationSection = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg border-2 border-custom-blue p-6 h-full">
      {/* About Us Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Info className="text-custom-blue w-5 h-5" />
          <h2 className="text-xl font-bold text-custom-blue">About Our Dementia Care System</h2>
        </div>
        <p className="text-gray-700 text-sm mb-2">
          Our platform helps doctors monitor and analyze speech patterns of dementia patients through advanced voice recording analysis.
        </p>
        <p className="text-gray-700 text-sm">
          Developed by the Faculty of Engineering, University of Ruhuna, this system provides clinical insights to support early detection and treatment monitoring.
        </p>
      </div>

      {/* Key Features */}
      <div className="mb-8">
        <h3 className="font-semibold text-custom-blue mb-2">Key Features:</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Voice recording analysis for pronunciation accuracy</li>
          <li>Longitudinal progress tracking</li>
          <li>Clinical decision support tools</li>
          <li>Standardized assessment reports</li>
        </ul>
      </div>

      {/* Contact Us Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="text-custom-blue w-5 h-5" />
          <h2 className="text-xl font-bold text-custom-blue">Contact Us</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-600 mt-0.5 w-4 h-4" />
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Address:</span> Faculty of Engineering, Hapugala, Galle, Sri Lanka
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="text-gray-600 w-4 h-4" />
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Phone:</span> +(94)0 91 2245765/6
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="text-gray-600 w-4 h-4" />
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Email:</span> webmaster@eng.ruh.ac.lk
            </p>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="text-custom-blue w-5 h-5" />
          <h2 className="text-xl font-bold text-custom-blue">Support Hours</h2>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="font-semibold">Weekdays:</span> 8:30 AM - 4:30 PM</p>
          <p><span className="font-semibold">Weekends:</span> Closed</p>
          <p><span className="font-semibold">Emergency Support:</span> Available 24/7 via phone</p>
        </div>
      </div>
    </div>
  );
};

export default InformationSection;


