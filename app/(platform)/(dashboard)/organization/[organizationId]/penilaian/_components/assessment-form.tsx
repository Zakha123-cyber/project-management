"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AssessmentFormDialog } from "./assessment-form-dialog";

interface AssessmentFormProps {
  member: any;
  activePeriod: any;
}

export const AssessmentForm = ({ member, activePeriod }: AssessmentFormProps) => {
  const [unassessedMembers, setUnassessedMembers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchUnassessedMembers = useCallback(async () => {
    if (!activePeriod) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/assessment/${activePeriod.id}/unassessed-members`);
      const data = await response.json();
      setUnassessedMembers(data.members);
      setStats({
        total: data.total,
        assessed: data.assessed,
        remaining: data.remaining,
      });
    } catch (error) {
      toast.error("Gagal memuat data anggota");
    } finally {
      setLoading(false);
    }
  }, [activePeriod]);

  useEffect(() => {
    fetchUnassessedMembers();
  }, [fetchUnassessedMembers]);

  const handleAssess = (memberToAssess: any) => {
    setSelectedMember(memberToAssess);
    setShowDialog(true);
  };

  const handleSuccess = () => {
    setShowDialog(false);
    setSelectedMember(null);
    fetchUnassessedMembers();
  };

  if (!activePeriod) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak Ada Periode Aktif</h3>
          <p className="text-sm text-neutral-600 text-center max-w-md">Saat ini tidak ada periode penilaian yang aktif. Silakan hubungi admin untuk membuka periode penilaian.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-500">Memuat data anggota...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Penilaian Anda</CardTitle>
          <CardDescription>Periode: {activePeriod.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats?.total || 0}</div>
              <div className="text-sm text-neutral-600">Total Anggota</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats?.assessed || 0}</div>
              <div className="text-sm text-neutral-600">Sudah Dinilai</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats?.remaining || 0}</div>
              <div className="text-sm text-neutral-600">Belum Dinilai</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Anggota yang Belum Dinilai</h3>

        {unassessedMembers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Semua Anggota Sudah Dinilai!</h3>
              <p className="text-sm text-neutral-600 text-center max-w-md">Anda sudah menyelesaikan penilaian untuk semua anggota di periode ini. Terima kasih atas partisipasinya!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unassessedMembers.map((memberToAssess) => (
              <Card key={memberToAssess.userId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {memberToAssess.name}
                  </CardTitle>
                  <CardDescription>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: memberToAssess.division?.color,
                        color: memberToAssess.division?.color,
                      }}
                    >
                      {memberToAssess.division?.name || "No Division"}
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {memberToAssess.role}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => handleAssess(memberToAssess)}>
                    Berikan Penilaian
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Dialog */}
      {selectedMember && (
        <AssessmentFormDialog
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          periodId={activePeriod.id}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
