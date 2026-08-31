import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Plus,
    X,
    Save,
    Trophy,
    Award,
    Building2,
    CalendarDays,
    Pencil,
    Trash2,
    AlertTriangle,
    ArrowLeft,
    ExternalLink,
    FileText,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    getMyAchievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
} from "../../services/achievementService";

// ==========================================
// SHARED STYLE TOKENS
// ==========================================

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls =
    "block text-sm font-semibold text-slate-700 mb-1.5";

const backdropCls =
    "fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4";

// ==========================================
// ACHIEVEMENTS PAGE
// ==========================================

const Achievements = () => {
    const navigate = useNavigate();

    // ==========================================
    // STATE
    // ==========================================

    const [achievements, setAchievements] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedAchievement, setSelectedAchievement] =
        useState(null);

    const initialFormData = {
        title: "",
        description: "",
        issuer: "",
        achievementDate: "",
        certificateUrl: "",
    };

    const [formData, setFormData] =
        useState(initialFormData);

    // ==========================================
    // LOAD ACHIEVEMENTS
    // ==========================================

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {
        try {
            setLoading(true);

            const data = await getMyAchievements();

            setAchievements(data);
        } catch (error) {
            console.error(
                "Achievements error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to load achievements.";

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
    // ADD ACHIEVEMENT
    // ==========================================

    const handleAddAchievement = async (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            toast.error(
                "Please enter an achievement title."
            );
            return;
        }

        if (!formData.description.trim()) {
            toast.error(
                "Please enter an achievement description."
            );
            return;
        }

        if (!formData.issuer.trim()) {
            toast.error(
                "Please enter the issuing organization."
            );
            return;
        }

        if (!formData.achievementDate) {
            toast.error(
                "Please select the achievement date."
            );
            return;
        }

        setSaving(true);

        try {
            const newAchievement =
                await addAchievement({
                    title: formData.title.trim(),
                    description:
                        formData.description.trim(),
                    issuer: formData.issuer.trim(),
                    achievementDate:
                    formData.achievementDate,
                    certificateUrl:
                        formData.certificateUrl.trim() || null,
                });

            setAchievements((previous) => [
                newAchievement,
                ...previous,
            ]);

            setFormData(initialFormData);

            setAddOpen(false);

            toast.success(
                "Achievement added successfully!"
            );
        } catch (error) {
            console.error(
                "Add achievement error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to add achievement.";

            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // OPEN EDIT
    // ==========================================

    const openEditAchievement = (
        achievement
    ) => {
        setSelectedAchievement(achievement);

        setFormData({
            title: achievement.title || "",
            description:
                achievement.description || "",
            issuer: achievement.issuer || "",
            achievementDate:
                achievement.achievementDate || "",
            certificateUrl:
                achievement.certificateUrl || "",
        });

        setEditOpen(true);
    };

    // ==========================================
    // UPDATE ACHIEVEMENT
    // ==========================================

    const handleUpdateAchievement =
        async (event) => {
            event.preventDefault();

            if (!selectedAchievement) return;

            if (!formData.title.trim()) {
                toast.error(
                    "Please enter an achievement title."
                );
                return;
            }

            if (!formData.description.trim()) {
                toast.error(
                    "Please enter an achievement description."
                );
                return;
            }

            if (!formData.issuer.trim()) {
                toast.error(
                    "Please enter the issuing organization."
                );
                return;
            }

            if (!formData.achievementDate) {
                toast.error(
                    "Please select the achievement date."
                );
                return;
            }

            setSaving(true);

            try {
                const updatedAchievement =
                    await updateAchievement(
                        selectedAchievement.id,
                        {
                            title: formData.title.trim(),
                            description:
                                formData.description.trim(),
                            issuer: formData.issuer.trim(),
                            achievementDate:
                            formData.achievementDate,
                            certificateUrl:
                                formData.certificateUrl.trim() ||
                                null,
                        }
                    );

                setAchievements((previous) =>
                    previous.map((achievement) =>
                        achievement.id ===
                        updatedAchievement.id
                            ? updatedAchievement
                            : achievement
                    )
                );

                setEditOpen(false);

                setSelectedAchievement(null);

                setFormData(initialFormData);

                toast.success(
                    "Achievement updated successfully!"
                );
            } catch (error) {
                console.error(
                    "Update achievement error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to update achievement.";

                toast.error(message);
            } finally {
                setSaving(false);
            }
        };

    // ==========================================
    // OPEN DELETE
    // ==========================================

    const openDeleteAchievement = (
        achievement
    ) => {
        setSelectedAchievement(achievement);

        setDeleteOpen(true);
    };

    // ==========================================
    // DELETE ACHIEVEMENT
    // ==========================================

    const handleDeleteAchievement =
        async () => {
            if (!selectedAchievement) return;

            setDeleting(true);

            try {
                await deleteAchievement(
                    selectedAchievement.id
                );

                setAchievements((previous) =>
                    previous.filter(
                        (achievement) =>
                            achievement.id !==
                            selectedAchievement.id
                    )
                );

                setDeleteOpen(false);

                setSelectedAchievement(null);

                toast.success(
                    "Achievement deleted successfully!"
                );
            } catch (error) {
                console.error(
                    "Delete achievement error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to delete achievement.";

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

        setFormData(initialFormData);
    };

    const closeEditModal = () => {
        if (saving) return;

        setEditOpen(false);

        setSelectedAchievement(null);

        setFormData(initialFormData);
    };

    const closeDeleteModal = () => {
        if (deleting) return;

        setDeleteOpen(false);

        setSelectedAchievement(null);
    };

    // ==========================================
    // HELPERS
    // ==========================================

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getCurrentYearCount = () => {
        const currentYear =
            new Date().getFullYear();

        return achievements.filter(
            (achievement) =>
                achievement.achievementDate &&
                new Date(
                    `${achievement.achievementDate}T00:00:00`
                ).getFullYear() === currentYear
        ).length;
    };

    const uniqueIssuers =
        new Set(
            achievements.map(
                (achievement) =>
                    achievement.issuer
                        ?.trim()
                        ?.toLowerCase()
            )
        ).size;

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-slate-600 font-medium">
                        Loading your achievements...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>

            {/* ==========================================
          BACK
      ========================================== */}

            <button
                onClick={() =>
                    navigate("/profile")
                }
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
                    <p className="text-sm font-medium text-blue-600 mb-1">
                        Student Profile
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        My Achievements
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Showcase your certifications,
                        accomplishments, and milestones.
                    </p>
                </div>

                <button
                    onClick={() =>
                        setAddOpen(true)
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0"
                >
                    <Plus size={17} />
                    Add Achievement
                </button>

            </section>

            {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

                <SummaryCard
                    title="Total Achievements"
                    value={achievements.length}
                    icon={<Trophy size={19} />}
                    iconBg="bg-blue-50 text-blue-600"
                    valueCls="text-blue-700"
                />

                <SummaryCard
                    title="This Year"
                    value={getCurrentYearCount()}
                    icon={<CalendarDays size={19} />}
                    iconBg="bg-purple-50 text-purple-600"
                    valueCls="text-purple-700"
                />

                <SummaryCard
                    title="Organizations"
                    value={uniqueIssuers}
                    icon={<Building2 size={19} />}
                    iconBg="bg-green-50 text-green-600"
                    valueCls="text-green-700"
                />

            </section>

            {/* ==========================================
          ACHIEVEMENTS LIST
      ========================================== */}

            <section className="bg-white rounded-2xl border border-slate-200 p-6">

                <div className="mb-5">
                    <h2 className="text-base font-bold text-slate-900">
                        Your Achievements
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Highlight the accomplishments
                        that represent your academic and
                        professional journey.
                    </p>
                </div>

                {achievements.length === 0 ? (

                    <div className="py-14 text-center">

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                            <Trophy size={26} />
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                            No achievements added yet
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                            Add your certifications,
                            awards, competition results,
                            and other accomplishments to
                            strengthen your NEXUS profile.
                        </p>

                        <button
                            onClick={() =>
                                setAddOpen(true)
                            }
                            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            <Plus size={16} />
                            Add Your First Achievement
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {achievements.map(
                            (achievement) => (

                                <div
                                    key={achievement.id}
                                    className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
                                >

                                    {/* TOP */}

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex items-start gap-3 min-w-0">

                                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                                <Trophy size={20} />
                                            </div>

                                            <div className="min-w-0">

                                                <h3 className="font-bold text-slate-900 text-sm leading-snug break-words">
                                                    {achievement.title}
                                                </h3>

                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                                                    <Building2 size={13} />
                                                    <span className="truncate">
                            {achievement.issuer}
                          </span>
                                                </div>

                                            </div>

                                        </div>

                                        {/* ACTIONS */}

                                        <div className="flex items-center gap-1 shrink-0">

                                            <button
                                                onClick={() =>
                                                    openEditAchievement(
                                                        achievement
                                                    )
                                                }
                                                className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                                                title="Edit achievement"
                                            >
                                                <Pencil size={15} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    openDeleteAchievement(
                                                        achievement
                                                    )
                                                }
                                                className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                                title="Delete achievement"
                                            >
                                                <Trash2 size={15} />
                                            </button>

                                        </div>

                                    </div>

                                    {/* DESCRIPTION */}

                                    <p className="text-sm text-slate-600 leading-relaxed mt-4 line-clamp-3">
                                        {achievement.description}
                                    </p>

                                    {/* BOTTOM */}

                                    <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">

                                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <CalendarDays size={14} />

                                            {formatDate(
                                                achievement.achievementDate
                                            )}
                                        </div>

                                        {achievement.certificateUrl && (

                                            <a
                                                href={
                                                    achievement.certificateUrl
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                                            >
                                                <FileText size={14} />
                                                Certificate
                                                <ExternalLink size={12} />
                                            </a>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

            {/* ==========================================
          ADD ACHIEVEMENT MODAL
      ========================================== */}

            {addOpen && (

                <div
                    className={backdropCls}
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeAddModal();
                        }
                    }}
                >

                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">

                        <ModalHeader
                            title="Add Achievement"
                            description="Add an accomplishment to your NEXUS profile."
                            onClose={closeAddModal}
                            disabled={saving}
                        />

                        <form
                            onSubmit={
                                handleAddAchievement
                            }
                            className="p-6 space-y-5"
                        >

                            {/* TITLE */}

                            <div>
                                <label
                                    htmlFor="title"
                                    className={labelCls}
                                >
                                    Achievement Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. AWS Certified Cloud Practitioner"
                                    className={inputCls}
                                />
                            </div>

                            {/* DESCRIPTION */}

                            <div>
                                <label
                                    htmlFor="description"
                                    className={labelCls}
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe your achievement and what you accomplished"
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                            {/* ISSUER */}

                            <div>
                                <label
                                    htmlFor="issuer"
                                    className={labelCls}
                                >
                                    Issuing Organization
                                </label>

                                <input
                                    id="issuer"
                                    name="issuer"
                                    type="text"
                                    value={formData.issuer}
                                    onChange={handleChange}
                                    placeholder="e.g. Amazon Web Services"
                                    className={inputCls}
                                />
                            </div>

                            {/* DATE */}

                            <div>
                                <label
                                    htmlFor="achievementDate"
                                    className={labelCls}
                                >
                                    Achievement Date
                                </label>

                                <input
                                    id="achievementDate"
                                    name="achievementDate"
                                    type="date"
                                    value={
                                        formData.achievementDate
                                    }
                                    onChange={handleChange}
                                    className={inputCls}
                                />
                            </div>

                            {/* CERTIFICATE */}

                            <div>
                                <label
                                    htmlFor="certificateUrl"
                                    className={labelCls}
                                >
                                    Certificate URL
                                    <span className="text-slate-400 font-normal">
                    {" "}
                                        (Optional)
                  </span>
                                </label>

                                <input
                                    id="certificateUrl"
                                    name="certificateUrl"
                                    type="url"
                                    value={
                                        formData.certificateUrl
                                    }
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className={inputCls}
                                />

                                <p className="text-xs text-slate-400 mt-1">
                                    Add a public link to your
                                    certificate or credential.
                                </p>
                            </div>

                            <ModalButtons
                                onCancel={closeAddModal}
                                saving={saving}
                                saveText="Add Achievement"
                            />

                        </form>

                    </div>

                </div>

            )}

            {/* ==========================================
          EDIT ACHIEVEMENT MODAL
      ========================================== */}

            {editOpen &&
                selectedAchievement && (

                    <div
                        className={backdropCls}
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeEditModal();
                            }
                        }}
                    >

                        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">

                            <ModalHeader
                                title="Edit Achievement"
                                description="Update your achievement details."
                                onClose={closeEditModal}
                                disabled={saving}
                            />

                            <form
                                onSubmit={
                                    handleUpdateAchievement
                                }
                                className="p-6 space-y-5"
                            >

                                {/* TITLE */}

                                <div>
                                    <label
                                        htmlFor="editTitle"
                                        className={labelCls}
                                    >
                                        Achievement Title
                                    </label>

                                    <input
                                        id="editTitle"
                                        name="title"
                                        type="text"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputCls
                                        }
                                    />
                                </div>

                                {/* DESCRIPTION */}

                                <div>
                                    <label
                                        htmlFor="editDescription"
                                        className={labelCls}
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="editDescription"
                                        name="description"
                                        rows={4}
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>

                                {/* ISSUER */}

                                <div>
                                    <label
                                        htmlFor="editIssuer"
                                        className={labelCls}
                                    >
                                        Issuing Organization
                                    </label>

                                    <input
                                        id="editIssuer"
                                        name="issuer"
                                        type="text"
                                        value={
                                            formData.issuer
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputCls
                                        }
                                    />
                                </div>

                                {/* DATE */}

                                <div>
                                    <label
                                        htmlFor="editAchievementDate"
                                        className={labelCls}
                                    >
                                        Achievement Date
                                    </label>

                                    <input
                                        id="editAchievementDate"
                                        name="achievementDate"
                                        type="date"
                                        value={
                                            formData.achievementDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputCls
                                        }
                                    />
                                </div>

                                {/* CERTIFICATE */}

                                <div>
                                    <label
                                        htmlFor="editCertificateUrl"
                                        className={labelCls}
                                    >
                                        Certificate URL
                                        <span className="text-slate-400 font-normal">
                      {" "}
                                            (Optional)
                    </span>
                                    </label>

                                    <input
                                        id="editCertificateUrl"
                                        name="certificateUrl"
                                        type="url"
                                        value={
                                            formData.certificateUrl
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputCls
                                        }
                                    />
                                </div>

                                <ModalButtons
                                    onCancel={
                                        closeEditModal
                                    }
                                    saving={saving}
                                    saveText="Save Changes"
                                />

                            </form>

                        </div>

                    </div>

                )}

            {/* ==========================================
          DELETE CONFIRMATION
      ========================================== */}

            {deleteOpen &&
                selectedAchievement && (

                    <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">

                        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6">

                            <div className="flex items-start gap-4">

                                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                    <AlertTriangle
                                        size={21}
                                    />
                                </div>

                                <div>

                                    <h2 className="text-base font-bold text-slate-900">
                                        Delete Achievement?
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">

                                        Are you sure you want to
                                        remove{" "}

                                        <span className="font-semibold text-slate-700">
                      {
                          selectedAchievement.title
                      }
                    </span>

                                        {" "}from your profile?

                                    </p>

                                    <p className="text-xs text-slate-400 mt-1.5">
                                        This action cannot be
                                        undone.
                                    </p>

                                </div>

                            </div>

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={deleting}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={
                                        handleDeleteAchievement
                                    }
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
                                            <Trash2
                                                size={15}
                                            />

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

const SummaryCard = ({
                         title,
                         value,
                         icon,
                         iconBg,
                         valueCls,
                     }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">

        <div className="flex items-start justify-between gap-3">

            <div>

                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {title}
                </p>

                <p
                    className={`text-2xl font-bold mt-2 ${
                        valueCls ||
                        "text-slate-900"
                    }`}
                >
                    {value}
                </p>

            </div>

            <div
                className={`p-2.5 rounded-xl ${iconBg}`}
            >
                {icon}
            </div>

        </div>

    </div>
);

/* ==========================================
   MODAL HEADER
========================================== */

const ModalHeader = ({
                         title,
                         description,
                         onClose,
                         disabled,
                     }) => (
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

        <div>

            <h2 className="text-lg font-bold text-slate-900">
                {title}
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
                {description}
            </p>

        </div>

        <button
            type="button"
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

const ModalButtons = ({
                          onCancel,
                          saving,
                          saveText,
                      }) => (
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

export default Achievements;