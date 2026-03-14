// frontend/components/results/ItineraryModal.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { X, Plane, Hotel, MapPin, Calendar, Users, DollarSign, Download, Share2 } from 'lucide-react';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawParams: any;
}

export default function ItineraryModal({ isOpen, onClose, rawParams }: ItineraryModalProps) {
  const [selections, setSelections] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('trip_state');
      if (saved) {
        setSelections(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  if (!isOpen || !selections) return null;

  const flight = selections.flights?.[0];
  const stay = selections.stays?.[0];
  const totalCost = (flight?.price || 0) + (stay?.offerDetails?.price || 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Custom Itinerary</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
              {rawParams?.source?.name} → {rawParams?.destination?.name}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors border border-gray-200 shadow-sm"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Summary Cards */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <SummaryCard icon={<Calendar size={18}/>} label="Trip Dates" value={`${formatDate(rawParams.startDate)} - ${formatDate(rawParams.endDate)}`} />
              <SummaryCard icon={<Users size={18}/>} label="Travelers" value={`${rawParams.adults} Adults, ${rawParams.children} Children`} />
              <SummaryCard icon={<DollarSign size={18} className="text-emerald-600"/>} label="Est. Total Cost" value={`$${totalCost.toFixed(2)}`} highlight />
            </div>

            {/* Right Column: Selections */}
            <div className="md:col-span-2 flex flex-col gap-6">
              
              {/* Flight Selection */}
              <section>
                <SectionTitle icon={<Plane size={20}/>} title="Selected Flight" />
                {flight ? (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-black text-gray-900">{flight.airline_name}</span>
                      <span className="text-blue-600 font-bold">${flight.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex-1">
                        <p className="font-bold">{flight.itineraries[0].segments[0].departure_airport}</p>
                        <p className="text-xs">{new Date(flight.itineraries[0].segments[0].departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="h-px flex-1 bg-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2">✈️</div>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-bold">{flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival_airport}</p>
                        <p className="text-xs">{new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                  </div>
                ) : <EmptySelection text="No flight selected" />}
              </section>

              {/* Stay Selection */}
              <section>
                <SectionTitle icon={<Hotel size={20}/>} title="Selected Stay" />
                {stay ? (
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-gray-900">{stay.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                           <MapPin size={12}/> {stay.address?.lines?.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-black">${stay.offerDetails?.price?.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Total Stay</p>
                      </div>
                    </div>
                  </div>
                ) : <EmptySelection text="No hotel selected" />}
              </section>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Download size={18} /> Download PDF
          </button>
          <button className="px-6 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">{icon}</div>
      <h3 className="font-black text-gray-800 uppercase tracking-wider text-xs">{title}</h3>
    </div>
  );
}

function SummaryCard({ icon, label, value, highlight }: any) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`font-black text-sm ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function EmptySelection({ text }: { text: string }) {
  return <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl text-center text-xs text-gray-400 font-bold italic">{text}</div>;
}