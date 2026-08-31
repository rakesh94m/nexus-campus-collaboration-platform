import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Plus,
    X,
    Save,
    GraduationCap,
    Building2,
    CalendarDays,
    Pencil,
    Trash2,
    AlertTriangle,
    ArrowLeft,
    ExternalLink,
    Link as LinkIcon,
    Clock,
} from "lucide-react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
    getMyCertifications,
    addCertification,
    updateCertification,
    deleteCertification,
} from "../../services/certificationService";

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
// CERTIFICATIONS PAGE
// ==========================================

const Certifications = () => {

    const navigate = useNavigate();

    // ==========================================
    // STATE
    // ==========================================

    const [certifications, setCertifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [addOpen, setAddOpen] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [selectedCertification,
        setSelectedCertification] =
        useState(null);

    const initialFormData = {
        certificateName: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
        credentialUrl: "",
    };

    const [formData, setFormData] =
        useState(initialFormData);

    // ==========================================
    // LOAD CERTIFICATIONS
    // ==========================================

    useEffect(() => {
        loadCertifications();
    }, []);

    const loadCertifications = async () => {

        try {

            setLoading(true);

            const data =
                await getMyCertifications();

            setCertifications(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Certifications error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to load certifications.";

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    // ==========================================
    // VALIDATE
    // ==========================================

    const validateForm = () => {

        if (
            !formData.certificateName.trim()
        ) {

            toast.error(
                "Please enter the certification name."
            );

            return false;

        }

        if (
            !formData.issuingOrganization.trim()
        ) {

            toast.error(
                "Please enter the issuing organization."
            );

            return false;

        }

        if (!formData.issueDate) {

            toast.error(
                "Please select the issue date."
            );

            return false;

        }

        if (
            formData.expiryDate &&
            formData.expiryDate <
            formData.issueDate
        ) {

            toast.error(
                "Expiry date cannot be before the issue date."
            );

            return false;

        }

        return true;

    };

    // ==========================================
    // BUILD PAYLOAD
    // ==========================================

    const buildPayload = () => ({
        certificateName:
            formData.certificateName.trim(),

        issuingOrganization:
            formData
                .issuingOrganization
                .trim(),

        issueDate:
        formData.issueDate,

        expiryDate:
            formData.expiryDate || null,

        credentialUrl:
            formData
                .credentialUrl
                .trim() || null,
    });

    // ==========================================
    // ADD CERTIFICATION
    // ==========================================

    const handleAddCertification =
        async (event) => {

            event.preventDefault();

            if (!validateForm()) {
                return;
            }

            setSaving(true);

            try {

                const newCertification =
                    await addCertification(
                        buildPayload()
                    );

                setCertifications(
                    (previous) => [
                        newCertification,
                        ...previous,
                    ]
                );

                setFormData(
                    initialFormData
                );

                setAddOpen(false);

                toast.success(
                    "Certification added successfully!"
                );

            } catch (error) {

                console.error(
                    "Add certification error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to add certification.";

                toast.error(message);

            } finally {

                setSaving(false);

            }

        };

    // ==========================================
    // OPEN EDIT
    // ==========================================

    const openEditCertification =
        (certification) => {

            setSelectedCertification(
                certification
            );

            setFormData({
                certificateName:
                    certification.certificateName || "",

                issuingOrganization:
                    certification.issuingOrganization || "",

                issueDate:
                    certification.issueDate || "",

                expiryDate:
                    certification.expiryDate || "",

                credentialUrl:
                    certification.credentialUrl || "",
            });

            setEditOpen(true);

        };

    // ==========================================
    // UPDATE CERTIFICATION
    // ==========================================

    const handleUpdateCertification =
        async (event) => {

            event.preventDefault();

            if (!selectedCertification) {
                return;
            }

            if (!validateForm()) {
                return;
            }

            setSaving(true);

            try {

                const updatedCertification =
                    await updateCertification(
                        selectedCertification.id,
                        buildPayload()
                    );

                setCertifications(
                    (previous) =>
                        previous.map(
                            (certification) =>
                                certification.id ===
                                updatedCertification.id
                                    ? updatedCertification
                                    : certification
                        )
                );

                setEditOpen(false);

                setSelectedCertification(
                    null
                );

                setFormData(
                    initialFormData
                );

                toast.success(
                    "Certification updated successfully!"
                );

            } catch (error) {

                console.error(
                    "Update certification error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to update certification.";

                toast.error(message);

            } finally {

                setSaving(false);

            }

        };

    // ==========================================
    // OPEN DELETE
    // ==========================================

    const openDeleteCertification =
        (certification) => {

            setSelectedCertification(
                certification
            );

            setDeleteOpen(true);

        };

    // ==========================================
    // DELETE CERTIFICATION
    // ==========================================

    const handleDeleteCertification =
        async () => {

            if (!selectedCertification) {
                return;
            }

            setDeleting(true);

            try {

                await deleteCertification(
                    selectedCertification.id
                );

                setCertifications(
                    (previous) =>
                        previous.filter(
                            (certification) =>
                                certification.id !==
                                selectedCertification.id
                        )
                );

                setDeleteOpen(false);

                setSelectedCertification(
                    null
                );

                toast.success(
                    "Certification deleted successfully!"
                );

            } catch (error) {

                console.error(
                    "Delete certification error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to delete certification.";

                toast.error(message);

            } finally {

                setDeleting(false);

            }

        };

    // ==========================================
    // CLOSE MODALS
    // ==========================================

    const closeAddModal = () => {

        if (saving) {
            return;
        }

        setAddOpen(false);

        setFormData(
            initialFormData
        );

    };

    const closeEditModal = () => {

        if (saving) {
            return;
        }

        setEditOpen(false);

        setSelectedCertification(
            null
        );

        setFormData(
            initialFormData
        );

    };

    const closeDeleteModal = () => {

        if (deleting) {
            return;
        }

        setDeleteOpen(false);

        setSelectedCertification(
            null
        );

    };

    // ==========================================
    // HELPERS
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "Not specified";
        }

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    };

    const getCurrentYearCount = () => {

        const currentYear =
            new Date().getFullYear();

        return certifications.filter(
            (certification) =>
                certification.issueDate &&
                new Date(
                    `${certification.issueDate}T00:00:00`
                ).getFullYear() ===
                currentYear
        ).length;

    };

    const uniqueOrganizations =
        new Set(
            certifications
                .map(
                    (certification) =>
                        certification
                            .issuingOrganization
                            ?.trim()
                            ?.toLowerCase()
                )
                .filter(Boolean)
        ).size;

    const getExpiryStatus = (
        expiryDate
    ) => {

        if (!expiryDate) {
            return {
                label: "No expiry",
                className:
                    "bg-slate-100 text-slate-600",
            };
        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const expiry =
            new Date(
                `${expiryDate}T00:00:00`
            );

        if (expiry < today) {
            return {
                label: "Expired",
                className:
                    "bg-red-50 text-red-600",
            };
        }

        const difference =
            expiry - today;

        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        if (days <= 30) {
            return {
                label: "Expires soon",
                className:
                    "bg-amber-50 text-amber-700",
            };
        }

        return {
            label: "Active",
            className:
                "bg-green-50 text-green-700",
        };

    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-slate-600 font-medium">
                        Loading your certifications...
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
                        My Certifications
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Showcase your professional,
                        academic, and technical
                        certifications.
                    </p>

                </div>

                <button
                    onClick={() =>
                        setAddOpen(true)
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shrink-0"
                >
                    <Plus size={17} />
                    Add Certification
                </button>

            </section>


            {/* ==========================================
                SUMMARY CARDS
            ========================================== */}

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

                <SummaryCard
                    title="Total Certifications"
                    value={
                        certifications.length
                    }
                    icon={
                        <GraduationCap
                            size={19}
                        />
                    }
                    iconBg="bg-green-50 text-green-600"
                    valueCls="text-green-700"
                />

                <SummaryCard
                    title="Issued This Year"
                    value={
                        getCurrentYearCount()
                    }
                    icon={
                        <CalendarDays
                            size={19}
                        />
                    }
                    iconBg="bg-purple-50 text-purple-600"
                    valueCls="text-purple-700"
                />

                <SummaryCard
                    title="Organizations"
                    value={
                        uniqueOrganizations
                    }
                    icon={
                        <Building2
                            size={19}
                        />
                    }
                    iconBg="bg-blue-50 text-blue-600"
                    valueCls="text-blue-700"
                />

            </section>


            {/* ==========================================
                CERTIFICATIONS LIST
            ========================================== */}

            <section className="bg-white rounded-2xl border border-slate-200 p-6">

                <div className="mb-5">

                    <h2 className="text-base font-bold text-slate-900">
                        Your Certifications
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Keep your verified learning and
                        professional credentials organized.
                    </p>

                </div>


                {certifications.length === 0 ? (

                    <div className="py-14 text-center">

                        <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">

                            <GraduationCap
                                size={26}
                            />

                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                            No certifications added yet
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                            Add your professional,
                            academic, and technical
                            certifications to strengthen
                            your NEXUS profile.
                        </p>

                        <button
                            onClick={() =>
                                setAddOpen(true)
                            }
                            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            <Plus size={16} />
                            Add Your First Certification
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {certifications.map(
                            (certification) => {

                                const expiryStatus =
                                    getExpiryStatus(
                                        certification.expiryDate
                                    );

                                return (

                                    <div
                                        key={
                                            certification.id
                                        }
                                        className="border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
                                    >

                                        {/* TOP */}

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-start gap-3 min-w-0">

                                                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">

                                                    <GraduationCap
                                                        size={20}
                                                    />

                                                </div>

                                                <div className="min-w-0">

                                                    <h3 className="font-bold text-slate-900 text-sm leading-snug break-words">
                                                        {
                                                            certification.certificateName
                                                        }
                                                    </h3>

                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">

                                                        <Building2
                                                            size={13}
                                                        />

                                                        <span className="truncate">
                                                            {
                                                                certification.issuingOrganization
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="flex items-center gap-1 shrink-0">

                                                <button
                                                    onClick={() =>
                                                        openEditCertification(
                                                            certification
                                                        )
                                                    }
                                                    className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                                                    title="Edit certification"
                                                >
                                                    <Pencil
                                                        size={15}
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openDeleteCertification(
                                                            certification
                                                        )
                                                    }
                                                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                                    title="Delete certification"
                                                >
                                                    <Trash2
                                                        size={15}
                                                    />
                                                </button>

                                            </div>

                                        </div>


                                        {/* DATE DETAILS */}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                                            <div className="rounded-xl bg-slate-50 p-3">

                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">

                                                    <CalendarDays
                                                        size={13}
                                                    />

                                                    Issued

                                                </div>

                                                <p className="text-sm font-semibold text-slate-800 mt-1">
                                                    {
                                                        formatDate(
                                                            certification.issueDate
                                                        )
                                                    }
                                                </p>

                                            </div>

                                            <div className="rounded-xl bg-slate-50 p-3">

                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">

                                                    <Clock
                                                        size={13}
                                                    />

                                                    Expiry

                                                </div>

                                                <p className="text-sm font-semibold text-slate-800 mt-1">

                                                    {
                                                        certification.expiryDate
                                                            ? formatDate(
                                                                certification.expiryDate
                                                            )
                                                            : "Does not expire"
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/* BOTTOM */}

                                        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">

                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${expiryStatus.className}`}
                                            >
                                                {
                                                    expiryStatus.label
                                                }
                                            </span>

                                            {certification.credentialUrl && (

                                                <a
                                                    href={
                                                        certification.credentialUrl
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                                                >
                                                    <LinkIcon
                                                        size={14}
                                                    />

                                                    Credential

                                                    <ExternalLink
                                                        size={12}
                                                    />

                                                </a>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </section>


            {/* ==========================================
                ADD MODAL
            ========================================== */}

            {addOpen && (

                <CertificationModal
                    title="Add Certification"
                    description="Add a certification to your NEXUS profile."
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={
                        handleAddCertification
                    }
                    onClose={
                        closeAddModal
                    }
                    saving={saving}
                    submitText="Add Certification"
                />

            )}


            {/* ==========================================
                EDIT MODAL
            ========================================== */}

            {editOpen && (

                <CertificationModal
                    title="Edit Certification"
                    description="Update your certification information."
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={
                        handleUpdateCertification
                    }
                    onClose={
                        closeEditModal
                    }
                    saving={saving}
                    submitText="Save Changes"
                />

            )}


            {/* ==========================================
                DELETE MODAL
            ========================================== */}

            {deleteOpen && (

                <div
                    className={backdropCls}
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeDeleteModal();
                        }

                    }}
                >

                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6">

                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">

                            <AlertTriangle
                                size={23}
                            />

                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Delete Certification?
                        </h2>

                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">

                            Are you sure you want to delete{" "}

                            <span className="font-semibold text-slate-700">
                                {
                                    selectedCertification?.certificateName
                                }
                            </span>

                            ? This action cannot be undone.

                        </p>

                        <div className="flex items-center justify-end gap-3 mt-6">

                            <button
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    deleting
                                }
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handleDeleteCertification
                                }
                                disabled={
                                    deleting
                                }
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                            >

                                <Trash2
                                    size={16}
                                />

                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </DashboardLayout>
    );

};


// ==========================================
// CERTIFICATION MODAL
// ==========================================

const CertificationModal = ({
                                title,
                                description,
                                formData,
                                handleChange,
                                handleSubmit,
                                onClose,
                                saving,
                                submitText,
                            }) => {

    return (

        <div
            className={backdropCls}
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">


                {/* HEADER */}

                <div className="sticky top-0 z-10 bg-white flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {description}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="p-6 space-y-5"
                >

                    {/* CERTIFICATE NAME */}

                    <div>

                        <label
                            className={labelCls}
                        >
                            Certification Name
                        </label>

                        <input
                            name="certificateName"
                            type="text"
                            value={
                                formData.certificateName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. AWS Certified Cloud Practitioner"
                            className={inputCls}
                            disabled={
                                saving
                            }
                        />

                    </div>


                    {/* ORGANIZATION */}

                    <div>

                        <label
                            className={labelCls}
                        >
                            Issuing Organization
                        </label>

                        <input
                            name="issuingOrganization"
                            type="text"
                            value={
                                formData.issuingOrganization
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. Amazon Web Services"
                            className={inputCls}
                            disabled={
                                saving
                            }
                        />

                    </div>


                    {/* DATES */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>

                            <label
                                className={labelCls}
                            >
                                Issue Date
                            </label>

                            <input
                                name="issueDate"
                                type="date"
                                value={
                                    formData.issueDate
                                }
                                onChange={
                                    handleChange
                                }
                                className={inputCls}
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        <div>

                            <label
                                className={labelCls}
                            >
                                Expiry Date
                                <span className="ml-1 text-xs font-normal text-slate-400">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                name="expiryDate"
                                type="date"
                                value={
                                    formData.expiryDate
                                }
                                onChange={
                                    handleChange
                                }
                                className={inputCls}
                                disabled={
                                    saving
                                }
                            />

                        </div>

                    </div>


                    {/* CREDENTIAL URL */}

                    <div>

                        <label
                            className={labelCls}
                        >
                            Credential URL
                            <span className="ml-1 text-xs font-normal text-slate-400">
                                (Optional)
                            </span>
                        </label>

                        <input
                            name="credentialUrl"
                            type="url"
                            value={
                                formData.credentialUrl
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://..."
                            className={inputCls}
                            disabled={
                                saving
                            }
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={
                                saving
                            }
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >

                            <Save
                                size={16}
                            />

                            {saving
                                ? "Saving..."
                                : submitText}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


// ==========================================
// SUMMARY CARD
// ==========================================

const SummaryCard = ({
                         title,
                         value,
                         icon,
                         iconBg,
                         valueCls,
                     }) => {

    return (

        <div className="bg-white rounded-2xl border border-slate-200 p-5">

            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
            >
                {icon}
            </div>

            <p
                className={`text-2xl font-bold mt-3 ${valueCls}`}
            >
                {value}
            </p>

            <p className="text-xs font-medium text-slate-500 mt-1">
                {title}
            </p>

        </div>

    );

};

export default Certifications;