"use client";

import { useState, useEffect } from "react";
import { TaskCard } from "./task-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface TasksListProps {
  member: any;
  divisions: any[];
}

export const TasksList = ({ member, divisions }: TasksListProps) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = selectedDivision === "all"
          ? "/api/tasks"
          : `/api/tasks?divisionId=${selectedDivision}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDivision]);

  // Filter tasks by status
  const notStartedTasks = tasks.filter(t => t.status === "NOT_STARTED");
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED");
  const overdueTasks = tasks.filter(t => t.status === "OVERDUE");

  // Check if task is overdue
  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.status !== "COMPLETED" && new Date(task.deadline) < now) {
            return { ...task, status: "OVERDUE" };
          }
          return task;
        })
      );
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter by Division */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Filter Divisi:</span>
        <Select value={selectedDivision} onValueChange={setSelectedDivision}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Divisi</SelectItem>
            {divisions.map((division) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Semua ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            Belum Mulai ({notStartedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Sedang Berjalan ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Selesai ({completedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Terlambat ({overdueTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Belum ada jobdesk
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} member={member} />
            ))
          )}
        </TabsContent>

        <TabsContent value="not-started" className="space-y-4 mt-6">
          {notStartedTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Tidak ada jobdesk yang belum dimulai
            </div>
          ) : (
            notStartedTasks.map((task) => (
              <TaskCard key={task.id} task={task} member={member} />
            ))
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4 mt-6">
          {inProgressTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Tidak ada jobdesk yang sedang berjalan
            </div>
          ) : (
            inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} member={member} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Belum ada jobdesk yang selesai
            </div>
          ) : (
            completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} member={member} />
            ))
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4 mt-6">
          {overdueTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Tidak ada jobdesk yang terlambat
            </div>
          ) : (
            overdueTasks.map((task) => (
              <TaskCard key={task.id} task={task} member={member} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
