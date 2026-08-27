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

      setRecommendations(
          Array.isArray(matches) ? matches : []
      );

      setMatchHistory(
          Array.isArray(history) ? history : []
      );

      if (showToast) {
        toast.success("Smart matching refreshed.");
      }
    } catch (err) {
      console.error(err);

      const message =
          err.response?.data?.message ||
          "Unable to load recommendations.";

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

      const result =
          await generateAIRecommendation(projectId);

      setAiRecommendations((previous) => ({
        ...previous,
        [projectId]: result,
      }));

      toast.success("AI analysis generated.");
    } catch (err) {
      console.error(err);

      const message =
          err.response?.data?.message ||
          "Unable to generate AI recommendation.";

      toast.error(message);
    } finally {
      setAiLoading(null);
    }
  };


  // ==========================================
  // SCORE LABEL
  // ==========================================

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return "Excellent Match";
    }

    if (score >= 60) {
      return "Strong Match";
    }

    if (score >= 40) {
      return "Good Match";
    }

    if (score >= 20) {
      return "Partial Match";
    }

    return "Low Match";
  };


  // ==========================================
  // SCORE WIDTH
  // ==========================================

  const getScoreWidth = (score) => {
    return `${Math.min(
        Math.max(score || 0, 0),
        100
    )}%`;
  };


  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
        <DashboardLayout>
          <div className="max-w-7xl mx-auto">

            <div className="mb-8">
              <div className="h-8 w-72 bg-slate-200 rounded-lg animate-pulse" />

              <div className="h-4 w-96 max-w-full bg-slate-200 rounded mt-3 animate-pulse" />
            </div>

            <div className="space-y-6">

              {[1, 2, 3].map((item) => (
                  <div
                      key={item}
                      className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse"
                  >
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

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Sparkles
                      size={22}
                      className="text-blue-600"
                  />

                </div>

                <div>

                  <h1 className="text-2xl font-bold text-slate-900">
                    AI Recommendations
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Discover projects that match your skills,
                    interests, and career goals.
                  </p>

                </div>

              </div>

            </div>


            {/* REFRESH */}

            <button
                onClick={() => loadRecommendations(true)}
                disabled={refreshing}
                className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-white
              border
              border-slate-200
              text-sm
              font-medium
              text-slate-700
              hover:bg-slate-50
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            >

              <RefreshCw
                  size={17}
                  className={
                    refreshing
                        ? "animate-spin"
                        : ""
                  }
              />

              {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

            </button>

          </div>


          {/* ==========================================
          TABS
        ========================================== */}

          <div className="flex items-center gap-3 mb-8">

            <button
                onClick={() => setActiveTab("matching")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === "matching"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600"
                }`}
            >
              Smart Matching
            </button>


            <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === "history"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600"
                }`}
            >
              Match History
            </button>

          </div>


          {/* ==========================================
          ERROR STATE
        ========================================== */}

          {error && (

              <div className="
            mb-6
            p-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            flex
            items-start
            gap-3
          ">

                <AlertCircle
                    size={20}
                    className="text-red-500 mt-0.5 shrink-0"
                />

                <div>

                  <p className="font-semibold text-red-800">
                    Unable to load recommendations
                  </p>

                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>

                </div>

              </div>

          )}


          {/* ==========================================
          SMART MATCHING
        ========================================== */}

          {activeTab === "matching" && !error && (

              recommendations.length === 0 ? (

                  <div className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-10
              text-center
            ">

                    <div className="
                w-14
                h-14
                mx-auto
                rounded-2xl
                bg-blue-50
                flex
                items-center
                justify-center
              ">

                      <Brain
                          size={26}
                          className="text-blue-600"
                      />

                    </div>

                    <h2 className="
                text-lg
                font-semibold
                text-slate-900
                mt-5
              ">
                      No project matches available
                    </h2>

                    <p className="
                text-sm
                text-slate-500
                mt-2
                max-w-md
                mx-auto
              ">
                      Add more skills to your profile so
                      Nexus can find better project matches
                      for you.
                    </p>

                  </div>

              ) : (

                  <div className="space-y-6">

                    {recommendations.map(
                        (recommendation, index) => {

                          const score =
                              Number(
                                  recommendation.matchScore || 0
                              );

                          const aiRecommendation =
                              aiRecommendations[
                                  recommendation.projectId
                                  ];

                          const isGenerating =
                              aiLoading ===
                              recommendation.projectId;


                          return (

                              <div
                                  key={
                                      recommendation.projectId ||
                                      index
                                  }
                                  className="
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        overflow-hidden
                        shadow-sm
                      "
                              >

                                {/* ==================================
                        PROJECT HEADER
                      ================================== */}

                                <div className="p-6 border-b border-slate-100">

                                  <div className="
                          flex
                          flex-col
                          lg:flex-row
                          lg:items-start
                          lg:justify-between
                          gap-5
                        ">

                                    <div className="flex-1">

                                      <div className="flex items-start gap-4">

                                        <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                                shrink-0
                              ">

                                          <Briefcase
                                              size={21}
                                              className="text-blue-600"
                                          />

                                        </div>


                                        <div>

                                          <div className="flex items-center gap-2 flex-wrap">

                                  <span className="
                                    text-xs
                                    font-semibold
                                    text-blue-600
                                    bg-blue-50
                                    px-2.5
                                    py-1
                                    rounded-full
                                  ">
                                    #{index + 1}
                                  </span>


                                            <span className="
                                    text-xs
                                    font-medium
                                    text-slate-500
                                  ">
                                    Smart Project Match
                                  </span>

                                          </div>


                                          <h2 className="
                                  text-xl
                                  font-bold
                                  text-slate-900
                                  mt-2
                                ">
                                            {recommendation.projectTitle}
                                          </h2>


                                          {recommendation.technologiesUsed && (

                                              <p className="
                                    text-sm
                                    text-slate-500
                                    mt-2
                                  ">

                                                Technologies:{" "}

                                                <span className="text-slate-700">
                                      {recommendation.technologiesUsed}
                                    </span>

                                              </p>

                                          )}

                                        </div>

                                      </div>

                                    </div>


                                    {/* SCORE */}

                                    <div className="lg:w-52">

                                      <div className="flex items-center justify-between mb-2">

                              <span className="
                                text-xs
                                font-semibold
                                text-slate-500
                              ">
                                Match Score
                              </span>


                                        <span className="
                                text-lg
                                font-bold
                                text-blue-600
                              ">
                                {score.toFixed(1)}%
                              </span>

                                      </div>


                                      <div className="
                              h-2
                              bg-slate-100
                              rounded-full
                              overflow-hidden
                            ">

                                        <div
                                            className="
                                  h-full
                                  bg-blue-600
                                  rounded-full
                                  transition-all
                                "
                                            style={{
                                              width:
                                                  getScoreWidth(score),
                                            }}
                                        />

                                      </div>


                                      <p className="
                              text-xs
                              text-right
                              text-slate-500
                              mt-1.5
                            ">
                                        {getScoreLabel(score)}
                                      </p>

                                    </div>

                                  </div>

                                </div>


                                {/* ==================================
                        JAVA MATCHING SUMMARY
                      ================================== */}

                                <div className="p-6">

                                  <div className="
                          rounded-xl
                          bg-slate-50
                          border
                          border-slate-100
                          p-5
                        ">

                                    <div className="
                            flex
                            items-center
                            gap-2
                            mb-3
                          ">

                                      <CheckCircle2
                                          size={18}
                                          className="text-green-500"
                                      />

                                      <h3 className="
                              text-sm
                              font-semibold
                              text-slate-900
                            ">
                                        Smart Matching Result
                                      </h3>

                                    </div>


                                    <p className="
                            text-sm
                            leading-6
                            text-slate-600
                          ">
                                      This project matches your profile
                                      based on your skills and the
                                      project's required skills.
                                    </p>

                                  </div>


                                  {/* ==================================
                          AI ANALYSIS BUTTON
                        ================================== */}

                                  {!aiRecommendation && (

                                      <div className="
                            mt-5
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-4
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50
                            p-5
                          ">

                                        <div>

                                          <div className="
                                flex
                                items-center
                                gap-2
                              ">

                                            <Brain
                                                size={19}
                                                className="text-blue-600"
                                            />

                                            <h3 className="
                                  font-semibold
                                  text-slate-900
                                ">
                                              AI Project Analysis
                                            </h3>

                                          </div>

                                          <p className="
                                text-sm
                                text-slate-600
                                mt-1
                              ">
                                            Get personalized insights,
                                            missing skills, roadmap,
                                            career advice and certification
                                            suggestions.
                                          </p>

                                        </div>


                                        <button
                                            onClick={() =>
                                                handleGenerateAI(
                                                    recommendation.projectId
                                                )
                                            }
                                            disabled={isGenerating}
                                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                text-white
                                text-sm
                                font-semibold
                                hover:bg-blue-700
                                transition
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                shrink-0
                              "
                                        >

                                          {isGenerating ? (

                                              <>
                                                <RefreshCw
                                                    size={17}
                                                    className="animate-spin"
                                                />

                                                Generating...
                                              </>

                                          ) : (

                                              <>
                                                <WandSparkles
                                                    size={17}
                                                />

                                                Generate AI Analysis
                                              </>

                                          )}

                                        </button>

                                      </div>

                                  )}


                                  {/* ==================================
                          AI ANALYSIS RESULT
                        ================================== */}

                                  {aiRecommendation && (

                                      <div className="mt-5">

                                        <div className="
                              flex
                              items-center
                              gap-2
                              mb-5
                            ">

                                          <Brain
                                              size={19}
                                              className="text-blue-600"
                                          />

                                          <h3 className="
                                font-semibold
                                text-slate-900
                              ">
                                            AI Analysis
                                          </h3>

                                        </div>


                                        <div className="
                              grid
                              grid-cols-1
                              lg:grid-cols-2
                              gap-5
                            ">

                                          {/* WHY PROJECT */}

                                          <div className="
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-100
                                p-5
                              ">

                                            <div className="
                                  flex
                                  items-center
                                  gap-2
                                  mb-3
                                ">

                                              <Target
                                                  size={18}
                                                  className="text-blue-600"
                                              />

                                              <h4 className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                  ">
                                                Why this project?
                                              </h4>

                                            </div>


                                            <p className="
                                  text-sm
                                  leading-6
                                  text-slate-600
                                ">
                                              {aiRecommendation.reason ||
                                                  "No detailed reason was generated."}
                                            </p>

                                          </div>


                                          {/* MISSING SKILLS */}

                                          <div className="
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-100
                                p-5
                              ">

                                            <div className="
                                  flex
                                  items-center
                                  gap-2
                                  mb-3
                                ">

                                              <AlertCircle
                                                  size={18}
                                                  className="text-orange-500"
                                              />

                                              <h4 className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                  ">
                                                Skills to develop
                                              </h4>

                                            </div>


                                            <p className="
                                  text-sm
                                  leading-6
                                  text-slate-600
                                ">
                                              {aiRecommendation.missingSkills ||
                                                  "No major missing skills identified."}
                                            </p>

                                          </div>


                                          {/* LEARNING ROADMAP */}

                                          <div className="
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-100
                                p-5
                              ">

                                            <div className="
                                  flex
                                  items-center
                                  gap-2
                                  mb-3
                                ">

                                              <BookOpen
                                                  size={18}
                                                  className="text-blue-600"
                                              />

                                              <h4 className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                  ">
                                                Learning Roadmap
                                              </h4>

                                            </div>


                                            <div className="
                                  text-sm
                                  leading-6
                                  text-slate-600
                                  whitespace-pre-line
                                ">
                                              {aiRecommendation.learningRoadmap ||
                                                  "No learning roadmap generated."}
                                            </div>

                                          </div>


                                          {/* CAREER ADVICE */}

                                          <div className="
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-100
                                p-5
                              ">

                                            <div className="
                                  flex
                                  items-center
                                  gap-2
                                  mb-3
                                ">

                                              <Briefcase
                                                  size={18}
                                                  className="text-blue-600"
                                              />

                                              <h4 className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                  ">
                                                Career Advice
                                              </h4>

                                            </div>


                                            <p className="
                                  text-sm
                                  leading-6
                                  text-slate-600
                                ">
                                              {aiRecommendation.careerAdvice ||
                                                  "No career advice generated."}
                                            </p>

                                          </div>

                                        </div>


                                        {/* CERTIFICATION */}

                                        <div className="
                              mt-5
                              rounded-xl
                              border
                              border-blue-100
                              bg-blue-50
                              p-5
                            ">

                                          <div className="
                                flex
                                items-center
                                gap-3
                              ">

                                            <div className="
                                  w-9
                                  h-9
                                  rounded-lg
                                  bg-white
                                  flex
                                  items-center
                                  justify-center
                                ">

                                              <Award
                                                  size={19}
                                                  className="text-blue-600"
                                              />

                                            </div>


                                            <div>

                                              <p className="
                                    text-xs
                                    font-semibold
                                    text-blue-600
                                    uppercase
                                    tracking-wide
                                  ">
                                                Recommended Certification
                                              </p>


                                              <p className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    mt-1
                                  ">
                                                {aiRecommendation.recommendedCertification ||
                                                    "No certification recommendation available."}
                                              </p>

                                            </div>

                                          </div>

                                        </div>


                                        {/* AI GENERATED MESSAGE */}

                                        <div className="
                              mt-5
                              flex
                              items-center
                              gap-2
                              text-xs
                              text-slate-500
                            ">

                                          <CheckCircle2
                                              size={16}
                                              className="text-green-500"
                                          />

                                          <span>
                                AI analysis generated using
                                your profile and this project.
                              </span>

                                        </div>

                                      </div>

                                  )}

                                </div>

                              </div>

                          );
                        }
                    )}

                  </div>

              )

          )}


          {/* ==========================================
          MATCH HISTORY
        ========================================== */}

          {activeTab === "history" && (

              <div className="space-y-5">

                {matchHistory.length === 0 ? (

                    <div className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-10
                text-center
              ">

                      <History
                          size={42}
                          className="mx-auto text-slate-300"
                      />

                      <h3 className="
                  text-lg
                  font-semibold
                  text-slate-900
                  mt-4
                ">
                        No Match History
                      </h3>

                      <p className="
                  text-sm
                  text-slate-500
                  mt-2
                ">
                        Generate Smart Matching first.
                        Previous matches will appear here
                        automatically.
                      </p>

                    </div>

                ) : (

                    matchHistory.map((match) => (

                        <div
                            key={match.id}
                            className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-6
                    shadow-sm
                  "
                        >

                          <div className="
                    flex
                    items-center
                    justify-between
                  ">

                            <div>

                              <div className="
                        flex
                        items-center
                        gap-2
                        mb-2
                      ">

                                <History
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span className="
                          text-xs
                          font-semibold
                          text-blue-600
                        ">
                          PREVIOUS MATCH
                        </span>

                              </div>


                              <h3 className="
                        text-lg
                        font-bold
                        text-slate-900
                      ">
                                {match.projectTitle ||
                                    `Project #${match.projectId}`}
                              </h3>


                              <p className="
                        text-sm
                        text-slate-500
                        mt-1
                      ">
                                {match.matchType
                                    ?.replaceAll("_", " ")}
                              </p>

                            </div>


                            <div className="text-right">

                              <div className="
                        text-2xl
                        font-bold
                        text-blue-600
                      ">
                                {Number(
                                    match.matchScore || 0
                                ).toFixed(1)}%
                              </div>

                              <p className="
                        text-xs
                        text-slate-500
                      ">
                                Match Score
                              </p>

                            </div>

                          </div>


                          <div className="
                    mt-5
                    h-2
                    bg-slate-100
                    rounded-full
                    overflow-hidden
                  ">

                            <div
                                className="
                        h-full
                        bg-blue-600
                        rounded-full
                      "
                                style={{
                                  width: `${Math.min(
                                      Math.max(
                                          match.matchScore || 0,
                                          0
                                      ),
                                      100
                                  )}%`,
                                }}
                            />

                          </div>


                          <div className="
                    mt-4
                    flex
                    justify-end
                    text-sm
                    text-slate-500
                  ">

                    <span>
                      {match.matchedAt
                          ? new Date(
                              match.matchedAt
                          ).toLocaleDateString()
                          : ""}
                    </span>

                          </div>

                        </div>

                    ))

                )}

              </div>

          )}

        </div>

      </DashboardLayout>
  );
};

export default Recommendations;