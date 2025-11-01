"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Users, TrendingUp, Award, Filter, Download, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  HARD_SKILLS_QUESTIONS,
  SOFT_SKILLS_QUESTIONS,
} from "@/config/assessment-questions";

interface AssessmentResultsProps {
  member: any;
}

interface MemberResult {
  userId: string;
  name: string;
  division: any;
  averageHardSkill: number;
  averageSoftSkill: number;
  averageTotal: number;
  assessmentCount: number;
  hardSkillsDetail: Array<{ index: number; average: number }>;
  softSkillsDetail: Array<{ index: number; average: number }>;
}

export const AssessmentResults = ({ member }: AssessmentResultsProps) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<MemberResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<MemberResult[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [divisions, setDivisions] = useState<any[]>([]);
  const [activePeriod, setActivePeriod] = useState<any>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAssessments: 0,
    averageScore: 0,
    highestScore: 0,
  });

  // Check if member is from BPI division
  const isBPI = member.division?.name === "BPI (Badan Pengurus Inti)";

  const toggleCard = (userId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedCards(newExpanded);
  };

  useEffect(() => {
    if (isBPI) {
      fetchResults();
    }
  }, [isBPI]);

  useEffect(() => {
    // Filter results by division
    if (selectedDivision === "all") {
      setFilteredResults(results);
    } else {
      setFilteredResults(
        results.filter((r) => r.division?.id === selectedDivision)
      );
    }
  }, [selectedDivision, results]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Fetch active period
      const periodRes = await fetch("/api/assessment/active-period");
      const periodData = await periodRes.json();
      setActivePeriod(periodData);

      if (!periodData) {
        setLoading(false);
        return;
      }

      // Fetch assessment results
      const resultsRes = await fetch(`/api/assessment/${periodData.id}/results`);
      const resultsData = await resultsRes.json();
      
      setResults(resultsData.results);
      setDivisions(resultsData.divisions);
      setStats(resultsData.stats);
      setFilteredResults(resultsData.results);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Gagal memuat hasil penilaian");
    } finally {
      setLoading(false);
    }
  };

  if (!isBPI) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-600">Akses Ditolak</h3>
          <p className="text-sm text-neutral-600 text-center max-w-md">
            Hanya anggota divisi BPI yang dapat melihat hasil penilaian.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-500">Memuat hasil penilaian...</div>
      </div>
    );
  }

  if (!activePeriod) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak Ada Periode Aktif</h3>
          <p className="text-sm text-neutral-600 text-center max-w-md">
            Belum ada periode penilaian yang aktif untuk ditampilkan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 4.0) return "text-blue-600";
    if (score >= 3.5) return "text-yellow-600";
    if (score >= 3.0) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Sangat Baik";
    if (score >= 4.0) return "Baik";
    if (score >= 3.5) return "Cukup Baik";
    if (score >= 3.0) return "Cukup";
    return "Perlu Perbaikan";
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hasil Penilaian</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Periode: <span className="font-semibold">{activePeriod.name}</span>
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Total Anggota Dinilai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalMembers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Total Penilaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.totalAssessments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Rata-rata Organisasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">
                {stats.averageScore.toFixed(2)}
              </span>
              <span className="text-sm text-neutral-500">/5.00</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Nilai Tertinggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold">
                {stats.highestScore.toFixed(2)}
              </span>
              <span className="text-sm text-neutral-500">/5.00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter Hasil</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih Divisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Divisi</SelectItem>
                  {divisions.map((div) => (
                    <SelectItem key={div.id} value={div.id}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-neutral-300 mb-4" />
            <p className="text-neutral-500">
              {selectedDivision === "all"
                ? "Belum ada hasil penilaian"
                : "Tidak ada hasil untuk divisi yang dipilih"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredResults.map((result, index) => (
            <Card key={result.userId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-600"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{result.name}</CardTitle>
                      <CardDescription>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: result.division?.color,
                            color: result.division?.color,
                          }}
                        >
                          {result.division?.name}
                        </Badge>
                        <span className="ml-2 text-xs">
                          ({result.assessmentCount} penilaian)
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${getScoreColor(
                        result.averageTotal
                      )}`}
                    >
                      {result.averageTotal.toFixed(2)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {getScoreLabel(result.averageTotal)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Nilai Keseluruhan</span>
                      <span className="text-neutral-600">
                        {result.averageTotal.toFixed(2)}/5.00
                      </span>
                    </div>
                    <Progress value={result.averageTotal * 20} className="h-2" />
                  </div>

                  <Separator />

                  {/* Hard Skills & Soft Skills */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-purple-700">
                          Hard Skills
                        </span>
                        <span className="text-neutral-600">
                          {result.averageHardSkill.toFixed(2)}
                        </span>
                      </div>
                      <Progress
                        value={result.averageHardSkill * 20}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-green-700">
                          Soft Skills
                        </span>
                        <span className="text-neutral-600">
                          {result.averageSoftSkill.toFixed(2)}
                        </span>
                      </div>
                      <Progress
                        value={result.averageSoftSkill * 20}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Toggle Detail Button */}
                  <button
                    onClick={() => toggleCard(result.userId)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800 transition py-2 hover:bg-purple-50 rounded-md"
                  >
                    {expandedCards.has(result.userId) ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Sembunyikan Detail
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Lihat Detail Per Indikator
                      </>
                    )}
                  </button>

                  {/* Detailed Breakdown */}
                  {expandedCards.has(result.userId) && (
                    <div className="space-y-6 pt-4 border-t">
                      {/* Hard Skills Detail */}
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-purple-700" />
                          Detail Hard Skills
                        </h4>
                        <div className="space-y-4">
                          {result.hardSkillsDetail.map((skill) => {
                            const question = HARD_SKILLS_QUESTIONS.find(
                              (q) => q.id === skill.index
                            );
                            if (!question) return null;

                            return (
                              <div key={skill.index} className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-900">
                                      {skill.index}. {question.label}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                      {question.description}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold text-purple-700 ml-4">
                                    {skill.average.toFixed(2)}
                                  </span>
                                </div>
                                <Progress
                                  value={skill.average * 20}
                                  className="h-1.5"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <Separator />

                      {/* Soft Skills Detail */}
                      <div>
                        <h4 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-green-700" />
                          Detail Soft Skills
                        </h4>
                        <div className="space-y-4">
                          {result.softSkillsDetail.map((skill) => {
                            const question = SOFT_SKILLS_QUESTIONS.find(
                              (q) => q.id === skill.index
                            );
                            if (!question) return null;

                            return (
                              <div key={skill.index} className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-900">
                                      {skill.index}. {question.label}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                      {question.description}
                                    </p>
                                  </div>
                                  <span className="text-sm font-semibold text-green-700 ml-4">
                                    {skill.average.toFixed(2)}
                                  </span>
                                </div>
                                <Progress
                                  value={skill.average * 20}
                                  className="h-1.5"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
