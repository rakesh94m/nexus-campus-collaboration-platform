import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Target,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  Circle,
  RefreshCw,
  X,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getMyGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../../services/goalService";

// ==========================================
// SHARED STYLE TOKENS
// ==========================================

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

const Goals = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "NOT_STARTED",
  });

  // ==========================================
  // LOAD GOALS
  // ==========================================

  const loadGoals = async () => {
    try {
      setLoading(true);

      const data = await getMyGoals();

      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Goals loading error:", error);

      toast.error(
          error?.response?.data?.message ||
          "Unable to load your goals."
      );

      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadGoals();
  }, []);

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      status: "NOT_STARTED",
    });
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title || "",
      description: goal.description || "",
      status: goal.status || "NOT_STARTED",
    });
    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    if (saving) {
      return;
    }
    setShowForm(false);
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      status: "NOT_STARTED",
    });
  };

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE GOAL
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }

    try {
      setSaving(true);

      if (editingGoal) {
        const updatedGoal = await updateGoal(editingGoal.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
        });

        setGoals((previous) =>
            previous.map((goal) =>
                goal.id === editingGoal.id ? updatedGoal : goal
            )
        );

        toast.success("Goal updated successfully.");
      } else {
        const newGoal = await addGoal({
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
        });

        setGoals((previous) => [newGoal, ...previous]);

        toast.success("Goal added successfully.");
      }

      handleCloseForm();
    } catch (error) {
      console.error("Goal save error:", error);

      toast.error(
          error?.response?.data?.message ||
          "Unable to save goal."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE GOAL
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this goal?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteGoal(id);

      setGoals((previous) =>
          previous.filter((goal) => goal.id !== id)
      );

      toast.success("Goal deleted successfully.");
    } catch (error) {
      console.error("Goal delete error:", error);

      toast.error(
          error?.response?.data?.message ||
          "Unable to delete goal."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // STATUS CONFIG
  // ==========================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          icon: CheckCircle2,
          container: "bg-emerald-50 text-emerald-700 border-emerald-100",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: Clock3,
          container: "bg-blue-50 text-blue-700 border-blue-100",
        };
      case "NOT_STARTED":
      default:
        return {
          label: "Not Started",
          icon: Circle,
          container: "bg-slate-50 text-slate-600 border-slate-200",
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <DashboardLayout>
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-500">Loading your goals...</p>
            </div>
          </div>
        </DashboardLayout>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
      <DashboardLayout>

        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition mb-5"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </button>

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Target size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 mb-0.5">Student Profile</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">My Goals</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Set and track your academic and career goals.
                </p>
              </div>
            </div>

            <button
                type="button"
                onClick={handleAddGoal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shrink-0"
            >
              <Plus size={17} />
              Add Goal
            </button>

          </section>

          {/* ==========================================
              SUMMARY CARDS
          ========================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

            {/* Total */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Goals</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{goals.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Target size={19} />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {goals.filter((g) => g.status === "IN_PROGRESS").length}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Clock3 size={19} />
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">
                    {goals.filter((g) => g.status === "COMPLETED").length}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={19} />
                </div>
              </div>
            </div>

          </div>

          {/* ==========================================
              GOAL LIST
          ========================================== */}

          {goals.length === 0 ? (

              <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                  <Target size={26} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">No Goals Yet</h2>
                <p className="max-w-md mx-auto mt-2 text-sm text-slate-500 leading-relaxed">
                  Create your first goal to start tracking your academic and career progress.
                </p>
                <button
                    type="button"
                    onClick={handleAddGoal}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <Plus size={16} />
                  Create Your First Goal
                </button>
              </div>

          ) : (

              <div className="space-y-3">
                {goals.map((goal) => {
                  const statusConfig = getStatusConfig(goal.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                      <div
                          key={goal.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                          {/* Goal content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h2 className="text-base font-bold text-slate-900 leading-snug">
                                {goal.title}
                              </h2>
                              <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${statusConfig.container}`}
                              >
                                <StatusIcon size={12} />
                                {statusConfig.label}
                              </span>
                            </div>

                            {goal.description && (
                                <p className="text-sm text-slate-500 leading-relaxed mt-1">
                                  {goal.description}
                                </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => handleEditGoal(goal)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                            >
                              <Pencil size={13} />
                              Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(goal.id)}
                                disabled={deletingId === goal.id}
                                className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete goal"
                            >
                              {deletingId === goal.id ? (
                                  <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                  <Trash2 size={14} />
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                  );
                })}
              </div>

          )}

          {/* ==========================================
              ADD / EDIT MODAL (showForm)
          ========================================== */}

          {showForm && (
              <div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) handleCloseForm();
                  }}
              >
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

                  {/* Modal header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {editingGoal ? "Edit Goal" : "Add New Goal"}
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {editingGoal
                          ? "Update your goal details."
                          : "Create a goal you want to achieve."}
                      </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleCloseForm}
                        disabled={saving}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
                        aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Title */}
                    <div>
                      <label htmlFor="goal-title" className={labelCls}>Goal Title</label>
                      <input
                          id="goal-title"
                          name="title"
                          type="text"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="What would you like to achieve?"
                          maxLength={200}
                          required
                          className={inputCls}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="goal-description" className={labelCls}>
                        Description
                        <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                      </label>
                      <textarea
                          id="goal-description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your goal"
                          rows={4}
                          className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="goal-status" className={labelCls}>Status</label>
                      <select
                          id="goal-status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className={inputCls}
                      >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>

                    {/* Form actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                          type="button"
                          onClick={handleCloseForm}
                          disabled={saving}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          disabled={saving}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Saving...
                            </>
                        ) : (
                            editingGoal ? "Update Goal" : "Add Goal"
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
          )}

        </div>

      </DashboardLayout>
  );
};

export default Goals;