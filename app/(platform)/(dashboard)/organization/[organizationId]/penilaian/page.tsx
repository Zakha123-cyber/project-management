import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClipboardCheck, BarChart3, Settings } from "lucide-react";

import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PeriodManagement } from "./_components/period-management";
import { AssessmentForm } from "./_components/assessment-form";
import { AssessmentResults } from "./_components/assessment-results";

const PenilaianPage = async () => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    redirect("/select-org");
  }

  // Get current member
  const member = await db.member.findUnique({
    where: { userId },
    include: { division: true },
  });

  if (!member) {
    redirect("/select-org");
  }

  // Get active period
  const activePeriod = await db.assessmentPeriod.findFirst({
    where: { isActive: true },
  });

  // Check if user is ADMIN or BPI member
  const isAdmin = member.role === "ADMIN";
  const isBPI = member.division?.name === "BPI (Badan Pengurus Inti)";
  const canManagePeriod = isAdmin;
  const canViewResults = isBPI;

  return (
    <div className="w-full mb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck className="w-6 h-6 text-neutral-700" />
          <h1 className="text-2xl font-bold text-neutral-700">Penilaian Anggota</h1>
        </div>
        <p className="text-sm text-neutral-600">
          {activePeriod ? (
            <>
              Periode Aktif: <span className="font-semibold text-green-600">{activePeriod.name}</span>
            </>
          ) : (
            <span className="text-orange-600 font-semibold">Tidak ada periode penilaian aktif</span>
          )}
        </p>
      </div>

      <Separator className="my-4" />

      <Tabs defaultValue="assess" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assess">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Nilai Anggota
          </TabsTrigger>
          {canViewResults && (
            <TabsTrigger value="results">
              <BarChart3 className="w-4 h-4 mr-2" />
              Hasil Penilaian
            </TabsTrigger>
          )}
          {canManagePeriod && (
            <TabsTrigger value="manage">
              <Settings className="w-4 h-4 mr-2" />
              Kelola Periode
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Nilai Anggota */}
        <TabsContent value="assess" className="mt-6">
          <AssessmentForm member={member} activePeriod={activePeriod} />
        </TabsContent>

        {/* Tab: Hasil Penilaian (BPI only) */}
        {canViewResults && (
          <TabsContent value="results" className="mt-6">
            <AssessmentResults member={member} />
          </TabsContent>
        )}

        {/* Tab: Kelola Periode (ADMIN only) */}
        {canManagePeriod && (
          <TabsContent value="manage" className="mt-6">
            <PeriodManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PenilaianPage;
