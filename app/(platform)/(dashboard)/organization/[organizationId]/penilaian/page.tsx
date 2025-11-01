import { Separator } from "@/components/ui/separator";
import { PenilaianForm } from "./_components/penilaian-form";
import { PenilaianResults } from "./_components/penilaian-results";
import { ClipboardCheck, BarChart3 } from "lucide-react";

const PenilaianPage = () => {
    return (
        <div className="w-full mb-20">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheck className="w-6 h-6 text-neutral-700" />
                    <h1 className="text-2xl font-bold text-neutral-700">
                        Penilaian Anggota
                    </h1>
                </div>
                <p className="text-sm text-neutral-600">
                    Periode Penilaian: <span className="font-semibold">Oktober 2025</span>
                </p>
            </div>

            <Separator className="my-4" />

            {/* Form Penilaian */}
            <div className="px-2 md:px-4">
                <PenilaianForm />
            </div>

            <Separator className="my-8" />

            {/* Hasil Penilaian (Hanya untuk Admin/Ketua) */}
            <div className="px-2 md:px-4">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-neutral-700" />
                    <h2 className="text-xl font-bold text-neutral-700">
                        Hasil Penilaian (Admin/Ketua)
                    </h2>
                </div>
                <PenilaianResults />
            </div>
        </div>
    );
};

export default PenilaianPage;
