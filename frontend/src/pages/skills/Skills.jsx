import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Save,
  Award,
  Sparkles,
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill,
  searchSkills,
} from "../../services/skillService";

// ==========================================
// SHARED STYLE TOKENS
// ==========================================

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

const backdropCls =
  "fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4";

const Skills = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState(null);

  const [formData, setFormData] = useState({
    skillName: "",
    proficiency: "",
  });

  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  // ==========================================
  // LOAD SKILLS
  // ==========================================

  const loadSkills = async () => {
    try {
      const data = await getMySkills();
      setSkills(data);
    } catch (error) {
      console.error("Skills error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to load skills.";
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
  // SEARCH SKILLS
  // ==========================================

  const handleSkillSearch = async (value) => {
    setFormData((prev) => ({
      ...prev,
      skillName: value,
    }));

    if (!value.trim()) {
      setSkillSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const data = await searchSkills(value);
      setSkillSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleAddSkill = async (event) => {
    event.preventDefault();

    if (!formData.skillName.trim()) {
      toast.error("Please enter a skill name.");
      return;
    }

    if (!formData.proficiency) {
      toast.error("Please select a proficiency level.");
      return;
    }

    setSaving(true);

    try {
      const newSkill = await addSkill({
        skillName: formData.skillName.trim(),
        proficiency: formData.proficiency,
      });

      setSkills((previous) => [...previous, newSkill]);

      setFormData({ skillName: "", proficiency: "" });
      setShowSuggestions(false);
      setSkillSuggestions([]);
      setAddOpen(false);

      toast.success("Skill added successfully!");
    } catch (error) {
      console.error("Add skill error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to add skill.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const openEditSkill = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      skillName: skill.skillName,
      proficiency: skill.proficiency,
    });
    setEditOpen(true);
  };

  // ==========================================
  // UPDATE SKILL
  // ==========================================

  const handleUpdateSkill = async (event) => {
    event.preventDefault();

    if (!formData.proficiency) {
      toast.error("Please select a proficiency level.");
      return;
    }

    setSaving(true);

    try {
      const updatedSkill = await updateSkill(
          selectedSkill.id,
          { proficiency: formData.proficiency }
      );

      setSkills((previous) =>
          previous.map((skill) =>
              skill.id === updatedSkill.id ? updatedSkill : skill
          )
      );

      setEditOpen(false);
      setSelectedSkill(null);
      setFormData({ skillName: "", proficiency: "" });

      toast.success("Skill updated successfully!");
    } catch (error) {
      console.error("Update skill error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to update skill.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OPEN DELETE CONFIRMATION
  // ==========================================

  const openDeleteSkill = (skill) => {
    setSelectedSkill(skill);
    setDeleteOpen(true);
  };

  // ==========================================
  // DELETE SKILL
  // ==========================================

  const handleDeleteSkill = async () => {
    if (!selectedSkill) return;

    setDeleting(true);

    try {
      await deleteSkill(selectedSkill.id);

      setSkills((previous) =>
          previous.filter((skill) => skill.id !== selectedSkill.id)
      );

      setDeleteOpen(false);
      setSelectedSkill(null);

      toast.success("Skill deleted successfully!");
    } catch (error) {
      console.error("Delete skill error:", error);
      const message =
          error.response?.data?.message ||
          "Unable to delete skill.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // CLOSE MODALS
  // ==========================================

  const closeAddModal = () => {
    if (saving) return;
    setAddOpen(false);
    setShowSuggestions(false);
    setSkillSuggestions([]);
    setFormData({ skillName: "", proficiency: "" });
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditOpen(false);
    setSelectedSkill(null);
    setFormData({ skillName: "", proficiency: "" });
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setSelectedSkill(null);
  };

  // ==========================================
  // HELPERS
  // ==========================================

  const getProficiencyStyle = (proficiency) => {
    switch (proficiency) {
      case "BEGINNER":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "INTERMEDIATE":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "ADVANCED":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "EXPERT":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const formatProficiency = (proficiency) => {
    if (!proficiency) return "Not specified";
    return proficiency
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your skills...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Skills</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Manage the technical and professional skills you have developed.
            </p>
          </div>
          <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0"
          >
            <Plus size={17} />
            Add Skill
          </button>
        </section>

        {/* ==========================================
            SUMMARY CARDS
        ========================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

          <SummaryCard
              title="Total Skills"
              value={skills.length}
              icon={<Award size={19} />}
              iconBg="bg-blue-50 text-blue-600"
              valueCls="text-blue-700"
          />

          <SummaryCard
              title="Advanced / Expert"
              value={
                skills.filter(
                    (s) => s.proficiency === "ADVANCED" || s.proficiency === "EXPERT"
                ).length
              }
              icon={<Sparkles size={19} />}
              iconBg="bg-purple-50 text-purple-600"
              valueCls="text-purple-700"
          />

          <SummaryCard
              title="Skill Diversity"
              value={new Set(skills.map((s) => s.skillName?.toLowerCase())).size}
              icon={<Award size={19} />}
              iconBg="bg-green-50 text-green-600"
              valueCls="text-green-700"
          />

        </section>

        {/* ==========================================
            SKILLS LIST
        ========================================== */}

        <section className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">Your Skills</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              These skills are used by NEXUS for project matching and recommendations.
            </p>
          </div>

          {skills.length === 0 ? (

              <div className="py-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Award size={26} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No skills added yet</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Add your technical and professional skills to improve project matching and AI recommendations.
                </p>
                <button
                    onClick={() => setAddOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <Plus size={16} />
                  Add Your First Skill
                </button>
              </div>

          ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
                    >
                      {/* Skill identity */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {skill.skillName?.charAt(0)?.toUpperCase()}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug break-words">
                          {skill.skillName}
                        </h3>
                      </div>

                      {/* Proficiency + actions */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getProficiencyStyle(skill.proficiency)}`}
                        >
                          {formatProficiency(skill.proficiency)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                              onClick={() => openEditSkill(skill)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                              title="Edit skill"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                              onClick={() => openDeleteSkill(skill)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete skill"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>

          )}

        </section>

        {/* ==========================================
            ADD SKILL MODAL
        ========================================== */}

        {addOpen && (
            <div
                className={backdropCls}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) closeAddModal();
                }}
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100">

                <ModalHeader
                    title="Add Skill"
                    description="Add a skill to your NEXUS profile."
                    onClose={closeAddModal}
                    disabled={saving}
                />

                <form onSubmit={handleAddSkill} className="p-6 space-y-5">

                  {/* Skill name with autocomplete */}
                  <div>
                    <label htmlFor="skillName" className={labelCls}>Skill Name</label>
                    <div className="relative">
                      <input
                          id="skillName"
                          type="text"
                          value={formData.skillName}
                          onChange={(e) => handleSkillSearch(e.target.value)}
                          onFocus={() => {
                            if (skillSuggestions.length > 0) setShowSuggestions(true);
                          }}
                          placeholder="Search or enter a skill"
                          className={inputCls}
                      />

                      {showSuggestions && formData.skillName && (
                          <div className="absolute z-20 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                            {skillSuggestions.map((skill) => (
                                <button
                                    type="button"
                                    key={skill.skillId}
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        skillName: skill.skillName,
                                      }));
                                      setShowSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                  {skill.skillName}
                                </button>
                            ))}
                            {skillSuggestions.length === 0 && (
                                <div className="px-4 py-3 text-sm text-blue-600 font-medium">
                                  New skill will be created: &ldquo;{formData.skillName}&rdquo;
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Proficiency */}
                  <div>
                    <label htmlFor="addProficiency" className={labelCls}>Proficiency Level</label>
                    <select
                        id="addProficiency"
                        name="proficiency"
                        value={formData.proficiency}
                        onChange={handleChange}
                        className={inputCls}
                    >
                      <option value="">Select proficiency</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>

                  <ModalButtons onCancel={closeAddModal} saving={saving} saveText="Add Skill" />

                </form>
              </div>
            </div>
        )}

        {/* ==========================================
            EDIT SKILL MODAL
        ========================================== */}

        {editOpen && selectedSkill && (
            <div
                className={backdropCls}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) closeEditModal();
                }}
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100">

                <ModalHeader
                    title="Edit Skill"
                    description={`Update the proficiency level for ${selectedSkill.skillName}.`}
                    onClose={closeEditModal}
                    disabled={saving}
                />

                <form onSubmit={handleUpdateSkill} className="p-6 space-y-5">

                  {/* Skill name — read only */}
                  <div>
                    <label className={labelCls}>Skill Name</label>
                    <input
                        type="text"
                        value={formData.skillName}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1">Skill name cannot be changed here.</p>
                  </div>

                  {/* Proficiency */}
                  <div>
                    <label htmlFor="editProficiency" className={labelCls}>Proficiency Level</label>
                    <select
                        id="editProficiency"
                        name="proficiency"
                        value={formData.proficiency}
                        onChange={handleChange}
                        className={inputCls}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>

                  <ModalButtons onCancel={closeEditModal} saving={saving} saveText="Save Changes" />

                </form>
              </div>
            </div>
        )}

        {/* ==========================================
            DELETE CONFIRMATION
        ========================================== */}

        {deleteOpen && selectedSkill && (
            <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6">

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={21} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Delete Skill?</h2>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                      Are you sure you want to remove{" "}
                      <span className="font-semibold text-slate-700">{selectedSkill.skillName}</span>{" "}
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
                      onClick={handleDeleteSkill}
                      disabled={deleting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition"
                  >
                    {deleting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Deleting...
                        </>
                    ) : (
                        <>
                          <Trash2 size={15} />
                          Delete
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

/* ==========================================
   SUMMARY CARD
========================================== */

const SummaryCard = ({ title, value, icon, iconBg, valueCls }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${valueCls || "text-slate-900"}`}>{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
      </div>
    </div>
);

/* ==========================================
   MODAL HEADER
========================================== */

const ModalHeader = ({ title, description, onClose, disabled }) => (
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
          onClick={onClose}
          disabled={disabled}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition"
          aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
);

/* ==========================================
   MODAL BUTTONS
========================================== */

const ModalButtons = ({ onCancel, saving, saveText }) => (
    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <button
          type="button"
          onClick={onCancel}
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
              Saving...
            </>
        ) : (
            <>
              <Save size={15} />
              {saveText}
            </>
        )}
      </button>
    </div>
);

export default Skills;