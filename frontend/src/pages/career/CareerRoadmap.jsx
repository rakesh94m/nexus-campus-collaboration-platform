import { useEffect, useState } from "react";

import {
  BriefcaseBusiness,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Lightbulb,
  RefreshCw,
  Target,
  BookOpen,
  Award,
  Sparkles,
  AlertCircle,
  History,
  ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  generateCareerRoadmap,
  getMyCareerRoadmaps,
  getLatestCareerRoadmap,
} from "../../services/careerService";

const CareerRoadmap = () => {
  const [roadmap, setRoadmap] = useState(null);

  const [roadmapHistory, setRoadmapHistory] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  // ==========================================
  // LOAD LATEST ROADMAP
  // ==========================================

  const loadLatestRoadmap = async () => {
    try {
      const data =
        await getLatestCareerRoadmap();

      setRoadmap(data);
    } catch (error) {
      /*
       * 404 means the student has not
       * generated a roadmap yet.
       */

      if (error?.response?.status !== 404) {
        console.error(
          "Career roadmap loading error:",
          error
        );
      }

      setRoadmap(null);
    }
  };

  // ==========================================
  // LOAD ROADMAP HISTORY
  // ==========================================

  const loadRoadmapHistory = async () => {
    try {
      setHistoryLoading(true);

      const data =
        await getMyCareerRoadmaps();

      setRoadmapHistory(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Career roadmap history loading error:",
        error
      );

      setRoadmapHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        await Promise.all([
          loadLatestRoadmap(),
          loadRoadmapHistory(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  // ==========================================
  // GENERATE AI ROADMAP
  // ==========================================

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      /*
       * Backend /generate now returns the
       * SAVED CareerRoadmapResponse.
       *
       * Every generation creates a NEW
       * database record.
       */

      const generated =
        await generateCareerRoadmap();

      setRoadmap(generated);

      /*
       * Add the newly generated roadmap
       * to the beginning of history.
       */

      setRoadmapHistory(
        (previous) => [
          generated,
          ...previous.filter(
            (item) =>
              item.id !== generated.id
          ),
        ]
      );

      toast.success(
        "AI career roadmap generated successfully."
      );
    } catch (error) {
      console.error(
        "Career roadmap generation error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to generate career roadmap."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // SELECT HISTORY ROADMAP
  // ==========================================

  const handleSelectRoadmap = (selectedRoadmap) => {
    setRoadmap(selectedRoadmap);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // FORMAT ROADMAP
  // ==========================================

  const formatRoadmap = (value) => {
    if (!value) {
      return [];
    }

    return value
      .split(
        /\.\s+(?=Step\s+\d+[:.-])/i
      )
      .map((step) => step.trim())
      .filter(Boolean);
  };

  // ==========================================
  // FORMAT SKILLS
  // ==========================================

  const formatList = (value) => {
    if (!value) {
      return [];
    }

    return value
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex items-center justify-center">

          <div className="text-center">

            <RefreshCw
              size={32}
              className="
                mx-auto
                text-blue-600
                animate-spin
              "
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your career roadmap...
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!roadmap) {
    return (
      <DashboardLayout>

        <div className="max-w-6xl mx-auto">

          {/* PAGE HEADER */}

          <section className="mb-8">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >
                <BrainCircuit size={23} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Career Roadmap
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Your personalized AI-powered career path.
                </p>

              </div>

            </div>

          </section>

          {/* EMPTY CARD */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-8
              sm:p-12
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <Sparkles size={30} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              Create Your Career Roadmap
            </h2>

            <p className="max-w-xl mx-auto mt-3 text-sm leading-6 text-slate-500">
              NEXUS will analyze your skills,
              interests, academic profile,
              goals, and availability to create
              a practical AI-powered career roadmap.
            </p>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-blue-600
                text-white
                text-sm
                font-semibold
                hover:bg-blue-700
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              <Sparkles
                size={17}
                className={
                  generating
                    ? "animate-spin"
                    : ""
                }
              />

              {generating
                ? "Generating..."
                : "Generate Career Roadmap"}

            </button>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  // ==========================================
  // PREPARE DISPLAY DATA
  // ==========================================

  const missingSkills =
    formatList(
      roadmap.missingSkills
    );

  const certifications =
    formatList(
      roadmap.recommendedCertifications
    );

  const roadmapSteps =
    formatRoadmap(
      roadmap.roadmap
    );

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <DashboardLayout>

      <div className="max-w-6xl mx-auto">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <section
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-8
          "
        >

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
              >
                <BrainCircuit size={23} />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Career Roadmap
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Your personalized AI-powered career path.
                </p>

              </div>

            </div>

          </div>

          {/* GENERATE AGAIN */}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              text-sm
              font-semibold
              hover:bg-slate-50
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >

            <RefreshCw
              size={17}
              className={
                generating
                  ? "animate-spin"
                  : ""
              }
            />

            {generating
              ? "Generating..."
              : "Generate Again"}

          </button>

        </section>


        {/* ==========================================
            AI CAREER GOAL
        ========================================== */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            sm:p-7
            shadow-sm
            mb-6
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                w-12
                h-12
                shrink-0
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <Target size={24} />
            </div>

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-blue-600
                "
              >
                Target Career
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">

                {roadmap.careerGoal ||
                  "Career Goal Not Available"}

              </h2>

              <p className="mt-2 text-sm text-slate-500">
                AI-generated career direction based on
                your current profile.
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            CURRENT SKILLS + MISSING SKILLS
        ========================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-6
            mb-6
          "
        >

          {/* CURRENT SKILLS */}

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  flex
                  items-center
                  justify-center
                "
              >
                <CheckCircle2 size={20} />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Current Skills
                </h3>

                <p className="text-xs text-slate-500">
                  Skills already supporting your career.
                </p>

              </div>

            </div>

            <p className="text-sm leading-7 text-slate-600">
              {roadmap.currentSkills ||
                "No current skills information available."}
            </p>

          </section>


          {/* MISSING SKILLS */}

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-amber-50
                  text-amber-600
                  flex
                  items-center
                  justify-center
                "
              >
                <Lightbulb size={20} />
              </div>

              <div>

                <h3 className="font-bold text-slate-900">
                  Skills to Develop
                </h3>

                <p className="text-xs text-slate-500">
                  Important skills for your target role.
                </p>

              </div>

            </div>

            {missingSkills.length > 0 ? (

              <div className="flex flex-wrap gap-2">

                {missingSkills.map(
                  (skill, index) => (

                    <span
                      key={`${skill}-${index}`}
                      className="
                        px-3
                        py-1.5
                        rounded-lg
                        bg-amber-50
                        text-amber-700
                        border
                        border-amber-100
                        text-xs
                        font-medium
                      "
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-slate-500">
                No missing skills identified.
              </p>

            )}

          </section>

        </div>


        {/* ==========================================
            LEARNING ROADMAP
        ========================================== */}

        <section
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            sm:p-7
            shadow-sm
            mb-6
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <BookOpen size={20} />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Learning Roadmap
              </h3>

              <p className="text-xs text-slate-500">
                Step-by-step path toward your target career.
              </p>

            </div>

          </div>


          {roadmapSteps.length > 0 ? (

            <div className="space-y-4">

              {roadmapSteps.map(
                (step, index) => {

                  const cleanedStep =
                    step.replace(
                      /^Step\s+\d+\s*[:.-]?\s*/i,
                      ""
                    );

                  return (
                    <div
                      key={`${index}-${cleanedStep}`}
                      className="
                        flex
                        items-start
                        gap-4
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-full
                          bg-blue-600
                          text-white
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-bold
                          shrink-0
                        "
                      >
                        {index + 1}
                      </div>

                      <div className="pt-1">

                        <p className="text-sm leading-6 text-slate-700">
                          {cleanedStep}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <p className="text-sm text-slate-500">
              No roadmap steps available.
            </p>

          )}

        </section>


        {/* ==========================================
            CAREER ADVICE
        ========================================== */}

        <section
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            sm:p-7
            shadow-sm
            mb-6
          "
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-indigo-50
                text-indigo-600
                flex
                items-center
                justify-center
              "
            >
              <BriefcaseBusiness size={20} />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Career Advice
              </h3>

              <p className="text-xs text-slate-500">
                Personalized guidance from your AI career mentor.
              </p>

            </div>

          </div>

          <p className="text-sm leading-7 text-slate-600">
            {roadmap.careerAdvice ||
              "No career advice available."}
          </p>

        </section>


        {/* ==========================================
            CERTIFICATIONS
        ========================================== */}

        <section
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            sm:p-7
            shadow-sm
            mb-6
          "
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-rose-50
                text-rose-600
                flex
                items-center
                justify-center
              "
            >
              <Award size={20} />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Recommended Certifications
              </h3>

              <p className="text-xs text-slate-500">
                Certifications that can strengthen your profile.
              </p>

            </div>

          </div>

          {certifications.length > 0 ? (

            <div className="space-y-2">

              {certifications.map(
                (certification, index) => (

                  <div
                    key={`${certification}-${index}`}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-slate-50
                      border
                      border-slate-100
                      p-4
                    "
                  >

                    <Award
                      size={17}
                      className="
                        text-rose-500
                        shrink-0
                      "
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {certification}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="text-sm text-slate-500">
              No certifications recommended.
            </p>

          )}

        </section>


        {/* ==========================================
            ROADMAP HISTORY
        ========================================== */}

        <section
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-6
            sm:p-7
            shadow-sm
            mb-6
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-slate-100
                text-slate-600
                flex
                items-center
                justify-center
              "
            >
              <History size={20} />
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Roadmap History
              </h3>

              <p className="text-xs text-slate-500">
                Previous AI-generated career roadmaps.
              </p>

            </div>

          </div>


          {historyLoading ? (

            <div className="flex items-center gap-3 py-4">

              <RefreshCw
                size={18}
                className="
                  text-blue-600
                  animate-spin
                "
              />

              <p className="text-sm text-slate-500">
                Loading roadmap history...
              </p>

            </div>

          ) : roadmapHistory.length === 0 ? (

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-5
                text-center
              "
            >

              <p className="text-sm text-slate-500">
                No previous roadmaps available.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {roadmapHistory.map(
                (historyItem, index) => {

                  const isSelected =
                    roadmap.id ===
                    historyItem.id;

                  return (

                    <button
                      key={
                        historyItem.id ||
                        index
                      }
                      type="button"
                      onClick={() =>
                        handleSelectRoadmap(
                          historyItem
                        )
                      }
                      className={`
                        w-full
                        text-left
                        rounded-xl
                        border
                        p-4
                        transition
                        flex
                        items-center
                        justify-between
                        gap-4

                        ${
                          isSelected
                            ? "border-blue-200 bg-blue-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }
                      `}
                    >

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <span
                            className="
                              text-xs
                              font-bold
                              text-slate-400
                            "
                          >
                            #{index + 1}
                          </span>

                          {isSelected && (

                            <span
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-blue-600
                                bg-blue-100
                                px-2
                                py-0.5
                                rounded-full
                              "
                            >
                              Viewing
                            </span>

                          )}

                        </div>

                        <h4
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-900
                            truncate
                          "
                        >
                          {historyItem.careerGoal ||
                            "Career Roadmap"}
                        </h4>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            mt-1
                          "
                        >

                          <Clock3
                            size={13}
                            className="text-slate-400"
                          />

                          <span className="text-xs text-slate-500">
                            {formatDate(
                              historyItem.generatedAt
                            )}
                          </span>

                        </div>

                      </div>

                      <ChevronRight
                        size={18}
                        className="
                          text-slate-400
                          shrink-0
                        "
                      />

                    </button>

                  );
                }
              )}

            </div>

          )}

        </section>


        {/* ==========================================
            FOOTER INFORMATION
        ========================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            px-1
            pb-6
          "
        >

          <div className="flex items-center gap-2">

            <Sparkles
              size={15}
              className="text-blue-500"
            />

            <p className="text-xs text-slate-400">
              Career roadmap generated using your profile and AI analysis.
            </p>

          </div>

          {roadmap.generatedAt && (

            <div className="flex items-center gap-2">

              <Clock3
                size={14}
                className="text-slate-400"
              />

              <p className="text-xs text-slate-400">

                Generated{" "}

                {formatDate(
                  roadmap.generatedAt
                )}

              </p>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default CareerRoadmap;