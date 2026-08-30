import { useEffect, useState } from "react";
import {
  Sparkles,
  Brain,
  Target,
  BookOpen,
  Briefcase,
  Award,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  History,
  WandSparkles,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getProjectMatches,
  getMatchHistory,
  generateAIRecommendation,
} from "../../services/matchingService";

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState("matching");
  const [recommendations, setRecommendations] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // AI RECOMMENDATION STATE
  // ==========================================

  const [aiLoading, setAiLoading] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState({});

  // ==========================================
  // LOAD SMART MATCHING + HISTORY
  //
  // IMPORTANT:
  // Gemini is NOT called here.
  // ==========================================

  const loadRecommendations = async (showToast = false) => {
    try {
      setError("");
      if (showToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [matches, history] = await Promise.all([
        getProjectMatches(),
        getMatchHistory(),
      ]);
      setRecommendations(Array.isArray(matches) ? matches : []);
      setMatchHistory(Array.isArray(history) ? history : []);
      if (showToast) {
        toast.success("Smart matching refreshed.");
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Unable to load recommendations.";
      setError(message);
      if (showToast) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadRecommendations();
  }, []);

  // ==========================================
  // GENERATE AI RECOMMENDATION
  //
  // Gemini is called ONLY when the user
  // clicks the button for a project.
  // ==========================================

  const handleGenerateAI = async (projectId) => {
    try {
      setAiLoading(projectId);
      const result = await generateAIRecommendation(projectId);
      setAiRecommendations((previous) => ({
        ...previous,
        [projectId]: result,
      }));
      toast.success("AI analysis generated.");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Unable to generate AI recommendation.";
      toast.error(message);
    } finally {
      setAiLoading(null);
    }
  };

  // ==========================================
  // SCORE LABEL
  // ==========================================

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Strong Match";
    if (score >= 40) return "Good Match";
    if (score >= 20) return "Partial Match";
    return "Low Match";
  };

  // ==========================================
  // SCORE COLOR
  // ==========================================

  const getScoreColor = (score) => {
    if (score >= 80) return { bar: "bg-emerald-500", text: "text-emerald-700", badge: "bg-emerald-50 border-emerald-100 text-emerald-700" };
    if (score >= 60) return { bar: "bg-blue-500", text: "text-blue-700", badge: "bg-blue-50 border-blue-100 text-blue-700" };
    if (score >= 40) return { bar: "bg-amber-500", text: "text-amber-700", badge: "bg-amber-50 border-amber-100 text-amber-700" };
    return { bar: "bg-red-400", text: "text-red-600", badge: "bg-red-50 border-red-100 text-red-600" };
  };

  // ==========================================
  // SCORE WIDTH
  // ==========================================

  const getScoreWidth = (score) => `${Math.min(Math.max(score || 0, 0), 100)}%`;

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-3" />
            <div className="h-8 w-72 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-slate-200 rounded mt-3 animate-pulse" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                <div className="h-6 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded mt-3" />
                <div className="h-4 w-full bg-slate-200 rounded mt-6" />
                <div className="h-4 w-5/6 bg-slate-200 rounded mt-2" />
                <div className="h-20 w-full bg-slate-100 rounded-xl mt-6" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1.5">
              Intelligence
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              AI Recommendations
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-lg">
              Discover projects that match your skills, interests, and career goals — powered by smart analysis of your profile.
            </p>
          </div>

          <button
            onClick={() => loadRecommendations(true)}
            disabled={refreshing}
            aria-label="Refresh recommendations"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>


        {/* ==========================================
            TABS
        ========================================== */}

        <div className="flex items-center gap-2 mb-8 bg-white border border-slate-200 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("matching")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "matching"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sparkles size={15} />
            Smart Matching
            {recommendations.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === "matching" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                {recommendations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "history"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <History size={15} />
            Match History
            {matchHistory.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === "history" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                {matchHistory.length}
              </span>
            )}
          </button>
        </div>


        {/* ==========================================
            ERROR STATE
        ========================================== */}

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Unable to load recommendations</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}


        {/* ==========================================
            SMART MATCHING TAB
        ========================================== */}

        {activeTab === "matching" && !error && (
          recommendations.length === 0 ? (

            <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">
                <Brain size={28} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-5">No project matches available</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Add more skills to your profile so NEXUS can find better project matches for you.
              </p>
            </div>

          ) : (

            <div className="space-y-6">
              {recommendations.map((recommendation, index) => {
                const score = Number(recommendation.matchScore || 0);
                const scoreColors = getScoreColor(score);
                const aiRecommendation = aiRecommendations[recommendation.projectId];
                const isGenerating = aiLoading === recommendation.projectId;

                return (
                  <div
                    key={recommendation.projectId || index}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >

                    {/* PROJECT HEADER */}
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                              <Briefcase size={20} className="text-blue-600" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                                  #{index + 1}
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                  Smart Project Match
                                </span>
                              </div>

                              <h2 className="text-xl font-bold text-slate-900 mt-2">
                                {recommendation.projectTitle}
                              </h2>

                              {recommendation.technologiesUsed && (
                                <p className="text-sm text-slate-500 mt-1.5">
                                  Technologies:{" "}
                                  <span className="text-slate-700 font-medium">{recommendation.technologiesUsed}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* SCORE PANEL */}
                        <div className="lg:w-52 shrink-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-500">Match Score</span>
                            <span className={`text-lg font-bold ${scoreColors.text}`}>
                              {score.toFixed(1)}%
                            </span>
                          </div>

                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${scoreColors.bar} rounded-full transition-all`}
                              style={{ width: getScoreWidth(score) }}
                            />
                          </div>

                          <div className="flex justify-end mt-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${scoreColors.badge}`}>
                              <TrendingUp size={11} />
                              {getScoreLabel(score)}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>


                    {/* MATCHING SUMMARY + AI */}
                    <div className="p-6">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <h3 className="text-sm font-semibold text-slate-900">Smart Matching Result</h3>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">
                          This project matches your profile based on your skills and the project&apos;s required skills.
                        </p>
                      </div>

                      {/* AI ANALYSIS BUTTON */}
                      {!aiRecommendation && (
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Brain size={17} className="text-blue-600" />
                              <h3 className="font-semibold text-slate-900 text-sm">AI Project Analysis</h3>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              Get personalized insights, missing skills, roadmap, career advice and certification suggestions.
                            </p>
                          </div>

                          <button
                            onClick={() => handleGenerateAI(recommendation.projectId)}
                            disabled={isGenerating}
                            aria-label="Generate AI analysis for this project"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                          >
                            {isGenerating ? (
                              <>
                                <RefreshCw size={15} className="animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <WandSparkles size={15} />
                                Generate AI Analysis
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* AI ANALYSIS RESULT */}
                      {aiRecommendation && (
                        <div className="mt-5">
                          <div className="flex items-center gap-2 mb-4">
                            <Brain size={17} className="text-blue-600" />
                            <h3 className="font-semibold text-slate-900">AI Analysis</h3>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* WHY PROJECT */}
                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Target size={15} className="text-blue-600" />
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Why this project?</h4>
                              </div>
                              <p className="text-sm leading-6 text-slate-600">
                                {aiRecommendation.reason || "No detailed reason was generated."}
                              </p>
                            </div>

                            {/* MISSING SKILLS */}
                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={15} className="text-amber-500" />
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Skills to develop</h4>
                              </div>
                              <p className="text-sm leading-6 text-slate-600">
                                {aiRecommendation.missingSkills || "No major missing skills identified."}
                              </p>
                            </div>

                            {/* LEARNING ROADMAP */}
                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={15} className="text-blue-600" />
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Learning Roadmap</h4>
                              </div>
                              <div className="text-sm leading-6 text-slate-600 whitespace-pre-line">
                                {aiRecommendation.learningRoadmap || "No learning roadmap generated."}
                              </div>
                            </div>

                            {/* CAREER ADVICE */}
                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase size={15} className="text-blue-600" />
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Career Advice</h4>
                              </div>
                              <p className="text-sm leading-6 text-slate-600">
                                {aiRecommendation.careerAdvice || "No career advice generated."}
                              </p>
                            </div>

                          </div>

                          {/* CERTIFICATION */}
                          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                                <Award size={18} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Recommended Certification</p>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                  {aiRecommendation.recommendedCertification || "No certification recommendation available."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* AI GENERATED MESSAGE */}
                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>AI analysis generated using your profile and this project.</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          )
        )}


        {/* ==========================================
            MATCH HISTORY TAB
        ========================================== */}

        {activeTab === "history" && (
          <div className="space-y-5">
            {matchHistory.length === 0 ? (

              <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <History size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-5">No Match History</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                  Generate smart matching first. Previous matches will appear here automatically.
                </p>
              </div>

            ) : (

              matchHistory.map((match) => {
                const score = Number(match.matchScore || 0);
                const scoreColors = getScoreColor(score);
                return (
                  <div key={match.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <History size={16} className="text-blue-600 shrink-0" />
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Previous Match</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 truncate">
                          {match.projectTitle || `Project #${match.projectId}`}
                        </h3>
                        {match.matchType && (
                          <p className="text-sm text-slate-500 mt-0.5">{match.matchType?.replaceAll("_", " ")}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-2xl font-bold ${scoreColors.text}`}>
                          {score.toFixed(1)}%
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border mt-1 ${scoreColors.badge}`}>
                          {getScoreLabel(score)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${scoreColors.bar} rounded-full`}
                        style={{ width: `${Math.min(Math.max(match.matchScore || 0, 0), 100)}%` }}
                      />
                    </div>

                    {match.matchedAt && (
                      <div className="mt-3 flex justify-end text-xs text-slate-400">
                        {new Date(match.matchedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                );
              })

            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
