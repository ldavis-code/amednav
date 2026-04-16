import { Link } from 'react-router-dom';
import { Pill, Shield, Quote } from 'lucide-react';
import { useMetaTags } from '../hooks/useMetaTags';
import { seoMetadata } from '../data/seo-metadata';

export default function SurveyLanding() {
  useMetaTags(seoMetadata.survey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-plum-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-plum-100">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Share Your Journey
          </h1>
          <p className="text-lg text-slate-600">
            Your experience can change the system
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Survey Card */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Medication Survey
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              For anyone who has trouble getting or paying for medicine.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              5 topic areas - takes about 5 minutes
            </p>
            <Link
              to="/survey/general"
              className="block w-full py-3 px-6 bg-slate-700 text-white text-center rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
            >
              Start Survey
            </Link>
          </div>
        </div>

        {/* Why We're Asking Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Quote className="w-5 h-5 text-plum-600" />
            Why We're Asking
          </h3>
          <blockquote className="text-slate-600 italic mb-4 border-l-4 border-plum-200 pl-4">
            "When you share your story, you help other patients. Together, we are building a guide that we wish we had. Your voice helps us fix a broken system."
          </blockquote>
          <p className="text-sm text-slate-500">
            — Lorrinda, TRIO President & Liver Transplant Recipient
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-plum-50 text-plum-700 px-4 py-2 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span><strong>Privacy:</strong> No names, dates, or medical records collected</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Powered by Amednav.com — By patients, for patients
          </p>
        </div>
      </div>
    </div>
  );
}
