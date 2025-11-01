import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TasksList } from "./_components/tasks-list";
import { CreateTaskButton } from "./_components/create-task-button";
import { ListTodo } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const TasksPage = async () => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    redirect("/select-org");
  }

  // Get current user member info
  const member = await db.member.findUnique({
    where: { userId },
    include: { division: true },
  });

  if (!member) {
    redirect("/select-org");
  }

  // Get all divisions for filter
  const divisions = await db.division.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full mb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ListTodo className="w-6 h-6 text-neutral-700" />
            <h1 className="text-2xl font-bold text-neutral-700">Manajemen Jobdesk</h1>
          </div>
          <p className="text-sm text-neutral-600">Kelola dan pantau semua jobdesk dari setiap divisi</p>
        </div>

        {/* Only ADMIN and COORDINATOR can create task */}
        {(member.role === "ADMIN" || member.role === "COORDINATOR") && <CreateTaskButton divisions={divisions} userRole={member.role} userDivisionId={member.divisionId} />}
      </div>

      <Separator className="my-4" />

      {/* Tasks List */}
      <TasksList member={member} divisions={divisions} />
    </div>
  );
};

export default TasksPage;
