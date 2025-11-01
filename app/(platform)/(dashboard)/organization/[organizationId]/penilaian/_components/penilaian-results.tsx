"use client";

import { useState } from "react";
import { BarChart, TrendingUp, Users, Award } from "lucide-react";

interface DivisionScore {
  name: string;
  color: string;
  scores: {
    kinerja: number;
    kedisiplinan: number;
    komunikasi: number;
    inisiatif: number;
    kerjasama: number;
    spesifik1: number;
    spesifik2: number;
  };
  average: number;
  totalResponden: number;
}

const dummyResults: DivisionScore[] = [
  {
    name: "Divisi Sosialisasi",
    color: "bg-blue-500",
    scores: {
      kinerja: 4.5,
      kedisiplinan: 4.2,
      komunikasi: 4.7,
      inisiatif: 4.3,
      kerjasama: 4.6,
      spesifik1: 4.8, // Kreativitas konten
      spesifik2: 4.4, // Efektivitas publikasi
    },
    average: 4.5,
    totalResponden: 15,
  },
  {
    name: "Divisi Logbook",
    color: "bg-green-500",
    scores: {
      kinerja: 4.6,
      kedisiplinan: 4.8,
      komunikasi: 4.3,
      inisiatif: 4.1,
      kerjasama: 4.4,
      spesifik1: 4.7, // Kelengkapan dokumentasi
      spesifik2: 4.9, // Kerapihan pencatatan
    },
    average: 4.5,
    totalResponden: 15,
  },
  {
    name: "Divisi Pemrograman",
    color: "bg-purple-500",
    scores: {
      kinerja: 4.7,
      kedisiplinan: 4.4,
      komunikasi: 4.0,
      inisiatif: 4.8,
      kerjasama: 4.2,
      spesifik1: 4.9, // Kualitas kode
      spesifik2: 4.7, // Problem solving
    },
    average: 4.5,
    totalResponden: 15,
  },
  {
    name: "Divisi Pembangunan",
    color: "bg-orange-500",
    scores: {
      kinerja: 4.3,
      kedisiplinan: 4.4,
      komunikasi: 4.2,
      inisiatif: 4.5,
      kerjasama: 4.4,
      spesifik1: 4.6, // Perencanaan proyek
      spesifik2: 4.3, // Pengelolaan sumber daya
    },
    average: 4.4,
    totalResponden: 15,
  },
  {
    name: "Divisi PDD",
    color: "bg-teal-500",
    scores: {
      kinerja: 4.4,
      kedisiplinan: 4.3,
      komunikasi: 4.6,
      inisiatif: 4.5,
      kerjasama: 4.7,
      spesifik1: 4.5, // Program pengembangan SDM
      spesifik2: 4.6, // Motivasi dan bimbingan
    },
    average: 4.5,
    totalResponden: 15,
  },
  {
    name: "Sekretaris",
    color: "bg-pink-500",
    scores: {
      kinerja: 4.8,
      kedisiplinan: 4.9,
      komunikasi: 4.7,
      inisiatif: 4.4,
      kerjasama: 4.6,
      spesifik1: 4.9, // Ketelitian administrasi
      spesifik2: 4.8, // Kecepatan respon
    },
    average: 4.7,
    totalResponden: 15,
  },
  {
    name: "Bendahara",
    color: "bg-yellow-500",
    scores: {
      kinerja: 4.7,
      kedisiplinan: 4.8,
      komunikasi: 4.5,
      inisiatif: 4.3,
      kerjasama: 4.4,
      spesifik1: 4.9, // Transparansi keuangan
      spesifik2: 4.8, // Akurasi laporan
    },
    average: 4.6,
    totalResponden: 15,
  },
  {
    name: "Ketua Pelaksana",
    color: "bg-red-500",
    scores: {
      kinerja: 4.9,
      kedisiplinan: 4.7,
      komunikasi: 4.8,
      inisiatif: 4.9,
      kerjasama: 4.8,
      spesifik1: 4.9, // Kepemimpinan
      spesifik2: 4.8, // Koordinasi divisi
    },
    average: 4.8,
    totalResponden: 15,
  },
];

const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => {
  const percentage = (score / 5) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-bold text-neutral-900">{score.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export const PenilaianResults = () => {
  const [selectedDivision, setSelectedDivision] = useState<number | null>(null);

  // Sort by average score
  const sortedResults = [...dummyResults].sort((a, b) => b.average - a.average);
  const topPerformer = sortedResults[0];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Responden</p>
              <p className="text-3xl font-bold">15</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Rata-rata Keseluruhan</p>
              <p className="text-3xl font-bold">{(dummyResults.reduce((sum, d) => sum + d.average, 0) / dummyResults.length).toFixed(1)}</p>
            </div>
            <BarChart className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Divisi Terbaik</p>
              <p className="text-lg font-bold">{topPerformer.name}</p>
              <p className="text-2xl font-bold">{topPerformer.average.toFixed(1)}</p>
            </div>
            <Award className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Division Rankings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Peringkat Divisi
        </h3>
        <div className="space-y-2">
          {sortedResults.map((division, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all cursor-pointer" onClick={() => setSelectedDivision(selectedDivision === index ? null : index)}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-bold text-lg">{index + 1}</div>
              <div className={`w-3 h-3 rounded-full ${division.color}`} />
              <div className="flex-1">
                <p className="font-semibold">{division.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-neutral-800">{division.average.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{division.totalResponden} responden</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyResults.map((division, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className={`${division.color} text-white p-4`}>
              <h3 className="text-lg font-bold">{division.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm opacity-90">Rata-rata Penilaian</p>
                <p className="text-3xl font-bold">{division.average.toFixed(1)}</p>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-3 uppercase">Detail Aspek Penilaian</h4>
              <ScoreBar label="Kinerja" score={division.scores.kinerja} color={division.color} />
              <ScoreBar label="Kedisiplinan" score={division.scores.kedisiplinan} color={division.color} />
              <ScoreBar label="Komunikasi" score={division.scores.komunikasi} color={division.color} />
              <ScoreBar label="Inisiatif" score={division.scores.inisiatif} color={division.color} />
              <ScoreBar label="Kerjasama" score={division.scores.kerjasama} color={division.color} />

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-sm text-gray-600 mb-3 uppercase">Aspek Spesifik</h4>
                <ScoreBar label="Spesifik 1" score={division.scores.spesifik1} color={division.color} />
                <ScoreBar label="Spesifik 2" score={division.scores.spesifik2} color={division.color} />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">Berdasarkan {division.totalResponden} responden</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Catatan:</strong> Data ini adalah hasil penilaian periode Oktober 2025. Penilaian dilakukan secara anonim oleh seluruh anggota tim PPK ORMAWA Paseban Kawis.
        </p>
      </div>
    </div>
  );
};
