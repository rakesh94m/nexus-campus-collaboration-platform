import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  X,
  Save,
  Heart,
  Sparkles,
  Trash2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getMyInterests,
  addInterest,
  deleteInterest,
} from "../../services/interestService";

// ==========================================
// SHARED STYLE TOKENS
// ==========================================

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

const backdropCls =
  "fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4";

const Interests = () => {

  const navigate = useNavigate();

  const [interests, setInterests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedInterest, setSelectedInterest] = useState(null);

  const [formData, setFormData] = useState({
    interestName: "",
  });

  // ==========================================
  // LOAD INTERESTS
  // ==========================================

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const data = await getMyInterests();
      setInterests(data);
    } catch (error) {
      console.error("Interests error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to load interests.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD INTEREST
  // ==========================================

  const handleAddInterest = async (event) => {
    event.preventDefault();

    if (!formData.interestName.trim()) {
      toast.error("Please enter an interest.");
      return;
    }

    setSaving(true);

    try {
      const newInterest = await addInterest({
        interestName: formData.interestName.trim(),
      });

      setInterests((previous) => [...previous, newInterest]);
      setFormData({ interestName: "" });
      setAddOpen(false);

      toast.success("Interest added successfully!");
    } catch (error) {
      console.error("Add interest error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to add interest.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN DELETE CONFIRMATION
  // ==========================================

  const openDeleteInterest = (interest) => {
    setSelectedInterest(interest);
    setDeleteOpen(true);
  };

  // ==========================================
  // DELETE INTEREST
  // ==========================================

  const handleDeleteInterest = async () => {
    if (!selectedInterest) return;

    setDeleting(true);

    try {
      await deleteInterest(selectedInterest.id);

      setInterests((previous) =>
          previous.filter((interest) => interest.id !== selectedInterest.id)
      );

      setDeleteOpen(false);
      setSelectedInterest(null);

      toast.success("Interest deleted successfully!");
    } catch (error) {
      console.error("Delete interest error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to delete interest.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // CLOSE ADD MODAL
  // ==========================================

  const closeAddModal = () => {
    if (saving) return;
    setAddOpen(false);
    setFormData({ interestName: "" });
  };

  // ==========================================
  // CLOSE DELETE MODAL
  // ==========================================

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setSelectedInterest(null);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your interests...</p>
          </div>
        </div>
    );
  }

  return (
      <DashboardLayout>

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

        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">Student Profile</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Interests</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Manage the areas and topics you are interested in.
            </p>
          </div>
          <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0"
          >
            <Plus size={17} />
            Add Interest
          </button>
        </section>

        {/* ==========================================
            SUMMARY CARDS
        ========================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Interests</p>
                <p className="text-2xl font-bold text-pink-600 mt-2">{interests.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600">
                <Heart size={19} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profile Matching</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {interests.length > 0 ? "Active" : "Add Interests"}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Sparkles size={19} />
              </div>
            </div>
          </div>

        </section>

        {/* ==========================================
            INTERESTS LIST
        ========================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">Your Interests</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Your interests help NEXUS understand which projects are relevant to you.
            </p>
          </div>

          {interests.length === 0 ? (

              <div className="py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Heart size={26} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No interests added yet</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Add your areas of interest to improve project matching and AI-powered recommendations.
                </p>
                <button
                    onClick={() => setAddOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <Plus size={16} />
                  Add Your First Interest
                </button>
              </div>

          ) : (

              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                    <div
                        key={interest.id}
                        className="inline-flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-xl border border-pink-100 bg-pink-50 hover:border-pink-200 hover:bg-pink-100 transition-colors group"
                    >
                      <Heart size={13} className="text-pink-500 shrink-0" />
                      <span className="text-sm font-semibold text-pink-700 max-w-[200px] truncate">
                        {interest.interestName}
                      </span>
                      <button
                          onClick={() => openDeleteInterest(interest)}
                          className="p-1 rounded-lg text-pink-400 hover:bg-pink-200 hover:text-red-600 transition ml-0.5"
                          title="Remove interest"
                      >
                        <X size={13} />
                      </button>
                    </div>
                ))}
              </div>

          )}

        </section>

        {/* ==========================================
            ADD INTEREST MODAL
        ========================================== */}

        {addOpen && (
            <div
                className={backdropCls}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeAddModal();
                }}
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Add Interest</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Add an area that interests you.</p>
                  </div>
                  <button
                      onClick={closeAddModal}
                      disabled={saving}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition"
                      aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddInterest} className="p-6 space-y-5">

                  <div>
                    <label htmlFor="interestName" className={labelCls}>Interest Name</label>
                    <input
                        id="interestName"
                        name="interestName"
                        type="text"
                        value={formData.interestName}
                        onChange={handleChange}
                        placeholder="Enter an interest"
                        className={inputCls}
                    />
                  </div>

                  {/* Example suggestions */}
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                      Quick suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Artificial Intelligence",
                        "Machine Learning",
                        "Web Development",
                        "Cloud Computing",
                        "Cybersecurity",
                        "Data Science",
                      ].map((example) => (
                          <button
                              key={example}
                              type="button"
                              onClick={() => setFormData({ interestName: example })}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600 transition"
                          >
                            {example}
                          </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={closeAddModal}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {saving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Adding...
                          </>
                      ) : (
                          <>
                            <Save size={15} />
                            Add Interest
                          </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
        )}

        {/* ==========================================
            DELETE CONFIRMATION MODAL
        ========================================== */}

        {deleteOpen && selectedInterest && (
            <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6">

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={21} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Remove Interest?</h2>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                      Are you sure you want to remove{" "}
                      <span className="font-semibold text-slate-700">{selectedInterest.interestName}</span>{" "}
                      from your profile?
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5">This action cannot be undone.</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                      onClick={closeDeleteModal}
                      disabled={deleting}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleDeleteInterest}
                      disabled={deleting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition"
                  >
                    {deleting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Removing...
                        </>
                    ) : (
                        <>
                          <Trash2 size={15} />
                          Remove
                        </>
                    )}
                  </button>
                </div>

              </div>
            </div>
        )}

      </DashboardLayout>
  );
};

export default Interests;