"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SyncMembersButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      toast.info("Mengambil data members dari Clerk...");
      
      const response = await fetch("/api/sync-members");
      const data = await response.json();

      if (data.success) {
        toast.success(
          `Berhasil! ${data.synced} member baru, ${data.existing} sudah ada`
        );
        
        // Refresh page to show new members
        router.refresh();
      } else {
        toast.error(data.error || "Gagal sync members");
      }
    } catch (error) {
      console.error("Error syncing members:", error);
      toast.error("Gagal sync members. Cek console untuk detail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleSync}
      disabled={isLoading}
      className="border-blue-600 text-blue-600 hover:bg-blue-50"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Syncing..." : "Sync dari Clerk"}
    </Button>
  );
};
