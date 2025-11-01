"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Question {
    id: string;
    text: string;
    type: "general" | "specific";
}

interface DivisionQuestions {
    name: string;
    color: string;
    questions: Question[];
}

const generalQuestions: Question[] = [
    { id: "g1", text: "Kinerja dalam menyelesaikan tugas", type: "general" },
    { id: "g2", text: "Kedisiplinan dan ketepatan waktu", type: "general" },
    { id: "g3", text: "Komunikasi dan koordinasi tim", type: "general" },
    { id: "g4", text: "Inisiatif dan proaktif dalam bekerja", type: "general" },
    { id: "g5", text: "Kerjasama dengan divisi lain", type: "general" },
];

const divisions: DivisionQuestions[] = [
    {
        name: "Divisi Sosialisasi",
        color: "bg-blue-500",
        questions: [
            ...generalQuestions,
            { id: "s1", text: "Kreativitas dalam pembuatan konten", type: "specific" },
            { id: "s2", text: "Efektivitas strategi publikasi", type: "specific" },
        ]
    },
    {
        name: "Divisi Logbook",
        color: "bg-green-500",
        questions: [
            ...generalQuestions,
            { id: "l1", text: "Kelengkapan dokumentasi kegiatan", type: "specific" },
            { id: "l2", text: "Kerapihan dan detail dalam pencatatan", type: "specific" },
        ]
    },
    {
        name: "Divisi Pemrograman",
        color: "bg-purple-500",
        questions: [
            ...generalQuestions,
            { id: "p1", text: "Kualitas kode dan sistem yang dikembangkan", type: "specific" },
            { id: "p2", text: "Kemampuan problem solving teknis", type: "specific" },
        ]
    },
    {
        name: "Divisi Pembangunan",
        color: "bg-orange-500",
        questions: [
            ...generalQuestions,
            { id: "pb1", text: "Perencanaan dan eksekusi proyek fisik", type: "specific" },
            { id: "pb2", text: "Pengelolaan sumber daya dan anggaran", type: "specific" },
        ]
    },
    {
        name: "Divisi PDD",
        color: "bg-teal-500",
        questions: [
            ...generalQuestions,
            { id: "pdd1", text: "Efektivitas program pengembangan SDM", type: "specific" },
            { id: "pdd2", text: "Kemampuan memotivasi dan membimbing", type: "specific" },
        ]
    },
    {
        name: "Sekretaris",
        color: "bg-pink-500",
        questions: [
            ...generalQuestions,
            { id: "sek1", text: "Ketelitian dalam administrasi", type: "specific" },
            { id: "sek2", text: "Kecepatan respon dan pelayanan", type: "specific" },
        ]
    },
    {
        name: "Bendahara",
        color: "bg-yellow-500",
        questions: [
            ...generalQuestions,
            { id: "ben1", text: "Transparansi pengelolaan keuangan", type: "specific" },
            { id: "ben2", text: "Akurasi laporan keuangan", type: "specific" },
        ]
    },
    {
        name: "Ketua Pelaksana",
        color: "bg-red-500",
        questions: [
            ...generalQuestions,
            { id: "kp1", text: "Kepemimpinan dan pengambilan keputusan", type: "specific" },
            { id: "kp2", text: "Kemampuan koordinasi antar divisi", type: "specific" },
        ]
    },
];

const scaleOptions = [
    { value: 1, label: "1 - Sangat Kurang" },
    { value: 2, label: "2 - Kurang" },
    { value: 3, label: "3 - Cukup" },
    { value: 4, label: "4 - Baik" },
    { value: 5, label: "5 - Sangat Baik" },
];

export const PenilaianForm = () => {
    const [selectedDivision, setSelectedDivision] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const currentDivision = divisions[selectedDivision];

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = () => {
        // Validasi semua pertanyaan sudah dijawab
        const allAnswered = currentDivision.questions.every(q => answers[q.id]);
        
        if (allAnswered) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setAnswers({});
                // Pindah ke divisi berikutnya atau kembali ke awal
                if (selectedDivision < divisions.length - 1) {
                    setSelectedDivision(selectedDivision + 1);
                } else {
                    setSelectedDivision(0);
                }
            }, 2000);
        } else {
            alert("Mohon jawab semua pertanyaan sebelum submit!");
        }
    };

    const progress = (Object.keys(answers).length / currentDivision.questions.length) * 100;

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                    Penilaian Berhasil Dikirim!
                </h3>
                <p className="text-green-600">
                    Terima kasih atas penilaian Anda untuk {currentDivision.name}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Division Selector */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Pilih Divisi yang Akan Dinilai:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {divisions.map((division, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelectedDivision(index);
                                setAnswers({});
                            }}
                            className={`p-3 rounded-lg font-semibold text-white transition-all ${
                                division.color
                            } ${
                                selectedDivision === index 
                                    ? "ring-4 ring-offset-2 ring-neutral-400 scale-105" 
                                    : "opacity-70 hover:opacity-100"
                            }`}
                        >
                            {division.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                    className={`h-full ${currentDivision.color} transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-sm text-gray-600 text-right">
                {Object.keys(answers).length} / {currentDivision.questions.length} pertanyaan terjawab
            </p>

            {/* Questions */}
            <div className={`${currentDivision.color} text-white p-4 rounded-lg`}>
                <h2 className="text-xl font-bold">Penilaian untuk {currentDivision.name}</h2>
            </div>

            <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                {/* General Questions */}
                <div>
                    <h4 className="font-semibold text-neutral-700 mb-4 text-lg border-b pb-2">
                        Pertanyaan Umum
                    </h4>
                    {currentDivision.questions
                        .filter(q => q.type === "general")
                        .map((question, index) => (
                            <div key={question.id} className="mb-6">
                                <p className="font-medium text-neutral-700 mb-3">
                                    {index + 1}. {question.text}
                                </p>
                                <div className="space-y-2">
                                    {scaleOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                answers[question.id] === option.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={option.value}
                                                checked={answers[question.id] === option.value}
                                                onChange={() => handleAnswerChange(question.id, option.value)}
                                                className="mr-3"
                                            />
                                            <span className={answers[question.id] === option.value ? "font-semibold" : ""}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Specific Questions */}
                <div>
                    <h4 className="font-semibold text-neutral-700 mb-4 text-lg border-b pb-2">
                        Pertanyaan Spesifik {currentDivision.name}
                    </h4>
                    {currentDivision.questions
                        .filter(q => q.type === "specific")
                        .map((question, index) => (
                            <div key={question.id} className="mb-6">
                                <p className="font-medium text-neutral-700 mb-3">
                                    {generalQuestions.length + index + 1}. {question.text}
                                </p>
                                <div className="space-y-2">
                                    {scaleOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                answers[question.id] === option.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={option.value}
                                                checked={answers[question.id] === option.value}
                                                onChange={() => handleAnswerChange(question.id, option.value)}
                                                className="mr-3"
                                            />
                                            <span className={answers[question.id] === option.value ? "font-semibold" : ""}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSubmit}
                        size="lg"
                        className={`${currentDivision.color} hover:opacity-90`}
                    >
                        Kirim Penilaian
                    </Button>
                </div>
            </div>
        </div>
    );
};
