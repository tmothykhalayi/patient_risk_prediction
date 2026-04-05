import { useState } from "react";
import {
  User,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

// Therapist Finder Component
export const TherapistFinder = ({ onBack }: { onBack: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");

  const specialties = [
    "All Specialties",
    "Burnout & Stress",
    "Anxiety & Depression",
    "Career Counseling",
    "Work-Life Balance",
    "ADHD & Focus",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-linear-to-br from-rose-500 to-rose-600 p-3 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Find a Therapist</h2>
              <p className="text-slate-600">Professional support when you need it most</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Search by location, name, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />

            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              {specialties.map((s) => (
                <option key={s} value={s.toLowerCase()}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Why Professional Help?</span>
            </h3>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>✓ Licensed professionals trained in mental health</li>
              <li>✓ Evidence-based therapeutic approaches</li>
              <li>✓ Confidential, judgment-free support</li>
              <li>✓ Personalized treatment plans</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-slate-600 mb-4">
              This feature is coming soon. In the meantime, consider these resources:
            </p>
            <div className="space-y-2">
              <a
                href="https://www.psychologytoday.com/us/therapists"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-linear-to-br from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all"
              >
                Psychology Today Therapist Directory
              </a>
              <a
                href="https://www.betterhelp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition-all"
              >
                BetterHelp Online Therapy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};