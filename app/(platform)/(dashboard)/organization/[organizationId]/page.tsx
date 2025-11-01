import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { DivisionDashboard } from "./_components/division-dashboard-server";

const OrganizationIdPage = async () => {
  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <DivisionDashboard />
        <Separator className="my-8" />
        <BoardList />
      </div>
    </div>
  );
};

export default OrganizationIdPage;
