"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, StarOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useAction } from "@/hooks/use-action";
import { submitAssessment } from "@/actions/submit-assessment";
import { HARD_SKILLS_QUESTIONS, SOFT_SKILLS_QUESTIONS, SCORE_LABELS } from "@/config/assessment-questions";

interface AssessmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  periodId: string;
  onSuccess: () => void;
}

export const AssessmentFormDialog = ({ isOpen, onClose, member, periodId, onSuccess }: AssessmentFormDialogProps) => {
  const router = useRouter();

  // Initialize scores with 0 (not selected)
  const [hardSkills, setHardSkills] = useState<Record<string, number>>({});
  const [softSkills, setSoftSkills] = useState<Record<string, number>>({});

  const { execute, isLoading } = useAction(submitAssessment, {
    onSuccess: () => {
      toast.success(`Penilaian untuk ${member.name} berhasil disimpan!`);
      router.refresh();
      onSuccess();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all questions are answered
    const allHardSkillsAnswered = HARD_SKILLS_QUESTIONS.every((q) => hardSkills[q.key] && hardSkills[q.key] >= 1 && hardSkills[q.key] <= 5);
    const allSoftSkillsAnswered = SOFT_SKILLS_QUESTIONS.every((q) => softSkills[q.key] && softSkills[q.key] >= 1 && softSkills[q.key] <= 5);

    if (!allHardSkillsAnswered || !allSoftSkillsAnswered) {
      toast.error("Semua pertanyaan harus dijawab (1-5)");
      return;
    }

    execute({
      periodId,
      assesseeId: member.userId,
      assesseeName: member.name,
      assesseeDivisionId: member.divisionId,
      ...hardSkills,
      ...softSkills,
    });
  };

  const renderScoreButtons = (category: "hard" | "soft", questionKey: string) => {
    const scores = category === "hard" ? hardSkills : softSkills;
    const setScores = category === "hard" ? setHardSkills : setSoftSkills;
    const currentScore = scores[questionKey] || 0;

    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => setScores({ ...scores, [questionKey]: score })}
            className={`
              flex-1 py-2 px-3 rounded-lg border-2 transition-all
              ${currentScore === score ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold" : "border-gray-200 hover:border-gray-300 text-gray-600"}
            `}
            disabled={isLoading}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{score}</span>
              {currentScore === score && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
            </div>
          </button>
        ))}
      </div>
    );
  };

  const calculateProgress = () => {
    const totalQuestions = 19;
    const answeredHard = HARD_SKILLS_QUESTIONS.filter((q) => hardSkills[q.key] >= 1).length;
    const answeredSoft = SOFT_SKILLS_QUESTIONS.filter((q) => softSkills[q.key] >= 1).length;
    return Math.round(((answeredHard + answeredSoft) / totalQuestions) * 100);
  };

  const progress = calculateProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle>Penilaian Anggota</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">{member.name}</span>
            <Badge
              variant="outline"
              style={{
                borderColor: member.division?.color,
                color: member.division?.color,
              }}
            >
              {member.division?.name}
            </Badge>
          </div>
          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-neutral-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 py-4">
              {/* Score Legend */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Skala Penilaian:</p>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {Object.entries(SCORE_LABELS).map(([score, label]) => (
                    <div key={score} className="text-center">
                      <div className="font-semibold text-blue-700">{score}</div>
                      <div className="text-blue-600">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hard Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-900">Penilaian Hard Skills</h3>
                </div>
                <p className="text-sm text-neutral-600">Nilai kemampuan teknis dan keterampilan khusus anggota</p>

                <div className="space-y-6">
                  {HARD_SKILLS_QUESTIONS.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-sm font-medium">
                        {index + 1}. {question.label}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <p className="text-xs text-neutral-500">{question.description}</p>
                      {renderScoreButtons("hard", question.key)}
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Soft Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <StarOff className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Penilaian Soft Skills</h3>
                </div>
                <p className="text-sm text-neutral-600">Nilai kemampuan interpersonal dan karakteristik pribadi anggota</p>

                <div className="space-y-6">
                  {SOFT_SKILLS_QUESTIONS.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-sm font-medium">
                        {index + 1}. {question.label}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <p className="text-xs text-neutral-500">{question.description}</p>
                      {renderScoreButtons("soft", question.key)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="flex-shrink-0 px-6 py-4 border-t bg-white">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading || progress < 100}>
                {isLoading ? "Menyimpan..." : "Simpan Penilaian"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
