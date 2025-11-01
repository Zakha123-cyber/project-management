"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CreatePeriodDialog } from "./create-period-dialog";
import { useAction } from "@/hooks/use-action";
import { togglePeriod } from "@/actions/toggle-period";

export const PeriodManagement = () => {
  const router = useRouter();
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { execute: executeToggle, isLoading: isToggling } = useAction(togglePeriod, {
    onSuccess: (data) => {
      toast.success(
        data.isActive
          ? `Periode "${data.name}" diaktifkan!`
          : `Periode "${data.name}" dinonaktifkan!`
      );
      fetchPeriods();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/assessment/periods");
      const data = await response.json();
      setPeriods(data);
    } catch (error) {
      toast.error("Gagal memuat periode penilaian");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleTogglePeriod = (periodId: string, currentStatus: boolean) => {
    executeToggle({
      id: periodId,
      isActive: !currentStatus,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-500">Memuat periode penilaian...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kelola Periode Penilaian</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Buat dan kelola periode penilaian anggota
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Periode Baru
        </Button>
      </div>

      {/* Periods List */}
      <div className="grid gap-4">
        {periods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-neutral-300 mb-4" />
              <p className="text-neutral-500 mb-4">
                Belum ada periode penilaian
              </p>
              <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Buat Periode Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          periods.map((period) => (
            <Card key={period.id} className={period.isActive ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {period.name}
                      {period.isActive && (
                        <Badge className="bg-green-500">Aktif</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {new Date(period.startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(period.endDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant={period.isActive ? "destructive" : "default"}
                    onClick={() => handleTogglePeriod(period.id, period.isActive)}
                    disabled={isToggling}
                  >
                    {period.isActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Nonaktifkan
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Aktifkan
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-neutral-600">
                  <div>
                    <span className="font-medium">Jumlah Penilaian:</span>{" "}
                    {period._count?.assessments || 0}
                  </div>
                  <div>
                    <span className="font-medium">Dibuat:</span>{" "}
                    {new Date(period.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Period Dialog */}
      <CreatePeriodDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchPeriods();
          router.refresh();
        }}
      />
    </div>
  );
};
