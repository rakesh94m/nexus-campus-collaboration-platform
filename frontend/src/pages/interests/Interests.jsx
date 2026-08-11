import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Save,
  Heart,
  Sparkles,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getMyInterests,
  addInterest,
  deleteInterest,
} from "../../services/interestService";

const Interests = () => {
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

  useEffect(() => {
    loadInterests();
  }, []);

  // ==========================================
  // LOAD INTERESTS
  // ==========================================

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

      setInterests((previous) => [
        ...previous,
        newInterest,
      ]);

      setFormData({
        interestName: "",
      });

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
        previous.filter(
          (interest) =>
            interest.id !== selectedInterest.id
        )
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

    setFormData({
      interestName: "",
    });
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

          <div
            className="w-10 h-10 border-4
                       border-blue-600
                       border-t-transparent
                       rounded-full
                       animate-spin
                       mx-auto mb-4"
          />

          <p className="text-slate-600 font-medium">
            Loading your interests...
          </p>

        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <section
        className="flex flex-col sm:flex-row
                   sm:items-center
                   justify-between
                   gap-4 mb-8"
      >

        <div>

          <p
            className="text-sm font-medium
                       text-blue-600 mb-1"
          >
            Student Profile
          </p>

          <h1
            className="text-3xl font-bold
                       text-slate-900"
          >
            My Interests
          </h1>

          <p
            className="mt-2
                       text-slate-500"
          >
            Manage the areas and topics
            you are interested in.
          </p>

        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center
                     justify-center gap-2
                     px-5 py-3
                     bg-blue-600
                     text-white
                     rounded-xl
                     font-semibold
                     hover:bg-blue-700
                     transition"
        >
          <Plus size={19} />
          Add Interest
        </button>

      </section>

      {/* ==========================================
          SUMMARY
      ========================================== */}

      <section
        className="grid grid-cols-1
                   sm:grid-cols-2
                   gap-4 mb-6"
      >

        <SummaryCard
          title="Total Interests"
          value={interests.length}
          icon={<Heart size={21} />}
        />

        <SummaryCard
          title="Profile Matching"
          value={
            interests.length > 0
              ? "Active"
              : "Add Interests"
          }
          icon={<Sparkles size={21} />}
        />

      </section>

      {/* ==========================================
          INTERESTS LIST
      ========================================== */}

      <section
        className="bg-white
                   rounded-2xl
                   border border-slate-200
                   p-6"
      >

        <div className="mb-6">

          <h2
            className="text-lg font-bold
                       text-slate-900"
          >
            Your Interests
          </h2>

          <p
            className="text-sm
                       text-slate-500 mt-1"
          >
            Your interests help NEXUS understand
            which projects are relevant to you.
          </p>

        </div>

        {interests.length === 0 ? (

          <div
            className="py-16
                       text-center"
          >

            <div
              className="w-16 h-16
                         rounded-2xl
                         bg-blue-50
                         text-blue-600
                         flex items-center
                         justify-center
                         mx-auto mb-4"
            >
              <Heart size={30} />
            </div>

            <h3
              className="text-lg font-bold
                         text-slate-900"
            >
              No interests added yet
            </h3>

            <p
              className="text-sm
                         text-slate-500
                         mt-2 max-w-md
                         mx-auto"
            >
              Add your areas of interest to
              improve project matching and
              AI-powered recommendations.
            </p>

            <button
              onClick={() => setAddOpen(true)}
              className="mt-5
                         inline-flex
                         items-center
                         gap-2
                         px-4 py-2.5
                         bg-blue-600
                         text-white
                         rounded-xl
                         text-sm
                         font-semibold
                         hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Your First Interest
            </button>

          </div>

        ) : (

          <div
            className="grid grid-cols-1
                       sm:grid-cols-2
                       lg:grid-cols-3
                       gap-4"
          >

            {interests.map((interest) => (

              <div
                key={interest.id}
                className="border
                           border-slate-200
                           rounded-2xl
                           p-5
                           hover:shadow-md
                           transition"
              >

                <div
                  className="flex items-center
                             justify-between
                             gap-4"
                >

                  <div
                    className="flex items-center
                               gap-4
                               min-w-0"
                  >

                    <div
                      className="w-12 h-12
                                 rounded-xl
                                 bg-blue-50
                                 text-blue-600
                                 flex items-center
                                 justify-center
                                 shrink-0"
                    >
                      <Heart size={22} />
                    </div>

                    <div className="min-w-0">

                      <h3
                        className="font-bold
                                   text-slate-900
                                   truncate"
                      >
                        {interest.interestName}
                      </h3>

                      <p
                        className="text-xs
                                   text-slate-400
                                   mt-1"
                      >
                        Interest #{interest.id}
                      </p>

                    </div>

                  </div>

                  {/* Delete Button */}

                  <button
                    onClick={() =>
                      openDeleteInterest(interest)
                    }
                    className="p-2
                               rounded-lg
                               text-slate-400
                               hover:bg-red-50
                               hover:text-red-600
                               transition
                               shrink-0"
                    title="Delete interest"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

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
          className="fixed inset-0
                     z-[100]
                     bg-black/50
                     flex items-center
                     justify-center
                     p-4"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddModal();
            }

          }}
        >

          <div
            className="w-full max-w-lg
                       bg-white
                       rounded-2xl
                       shadow-2xl"
          >

            {/* Modal Header */}

            <div
              className="flex
                         items-center
                         justify-between
                         px-6 py-5
                         border-b
                         border-slate-200"
            >

              <div>

                <h2
                  className="text-xl
                             font-bold
                             text-slate-900"
                >
                  Add Interest
                </h2>

                <p
                  className="text-sm
                             text-slate-500
                             mt-1"
                >
                  Add an area that interests you.
                </p>

              </div>

              <button
                onClick={closeAddModal}
                disabled={saving}
                className="p-2
                           rounded-lg
                           hover:bg-slate-100
                           text-slate-500
                           disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleAddInterest}
              className="p-6 space-y-5"
            >

              <div>

                <label
                  htmlFor="interestName"
                  className="block
                             text-sm
                             font-semibold
                             text-slate-700
                             mb-2"
                >
                  Interest Name
                </label>

                <input
                  id="interestName"
                  name="interestName"
                  type="text"
                  value={formData.interestName}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full
                             px-4 py-3
                             rounded-xl
                             border
                             border-slate-300
                             focus:outline-none
                             focus:ring-2
                             focus:ring-blue-500
                             focus:border-transparent"
                />

              </div>

              {/* Examples */}

              <div
                className="rounded-xl
                           bg-slate-50
                           p-4"
              >

                <p
                  className="text-xs
                             font-semibold
                             text-slate-600
                             mb-2"
                >
                  Examples
                </p>

                <div
                  className="flex flex-wrap
                             gap-2"
                >

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
                      onClick={() =>
                        setFormData({
                          interestName: example,
                        })
                      }
                      className="px-3 py-1.5
                                 rounded-lg
                                 bg-white
                                 border
                                 border-slate-200
                                 text-xs
                                 text-slate-600
                                 hover:border-blue-300
                                 hover:text-blue-600
                                 transition"
                    >
                      {example}
                    </button>

                  ))}

                </div>

              </div>

              {/* Buttons */}

              <div
                className="flex
                           justify-end
                           gap-3
                           pt-4
                           border-t
                           border-slate-200"
              >

                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={saving}
                  className="px-5 py-2.5
                             rounded-xl
                             border
                             border-slate-300
                             text-slate-700
                             font-semibold
                             hover:bg-slate-50
                             disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex
                             items-center
                             gap-2
                             px-5 py-2.5
                             rounded-xl
                             bg-blue-600
                             text-white
                             font-semibold
                             hover:bg-blue-700
                             disabled:opacity-60
                             disabled:cursor-not-allowed"
                >

                  {saving ? (
                    <>
                      <div
                        className="w-4 h-4
                                   border-2
                                   border-white
                                   border-t-transparent
                                   rounded-full
                                   animate-spin"
                      />

                      Adding...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
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

        <div
          className="fixed inset-0
                     z-[110]
                     bg-black/50
                     flex items-center
                     justify-center
                     p-4"
        >

          <div
            className="w-full max-w-md
                       bg-white
                       rounded-2xl
                       shadow-2xl
                       p-6"
          >

            <div
              className="flex
                         items-start
                         gap-4"
            >

              <div
                className="w-12 h-12
                           rounded-xl
                           bg-red-50
                           text-red-600
                           flex items-center
                           justify-center
                           shrink-0"
              >
                <AlertTriangle size={23} />
              </div>

              <div>

                <h2
                  className="text-lg
                             font-bold
                             text-slate-900"
                >
                  Delete Interest?
                </h2>

                <p
                  className="text-sm
                             text-slate-500
                             mt-2
                             leading-relaxed"
                >
                  Are you sure you want to remove{" "}
                  <span
                    className="font-semibold
                               text-slate-700"
                  >
                    {selectedInterest.interestName}
                  </span>{" "}
                  from your profile?
                </p>

                <p
                  className="text-xs
                             text-slate-400
                             mt-2"
                >
                  This action cannot be undone.
                </p>

              </div>

            </div>

            <div
              className="flex
                         justify-end
                         gap-3
                         mt-6"
            >

              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-5 py-2.5
                           rounded-xl
                           border
                           border-slate-300
                           text-slate-700
                           font-semibold
                           hover:bg-slate-50
                           disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteInterest}
                disabled={deleting}
                className="flex
                           items-center
                           gap-2
                           px-5 py-2.5
                           rounded-xl
                           bg-red-600
                           text-white
                           font-semibold
                           hover:bg-red-700
                           disabled:opacity-60"
              >

                {deleting ? (
                  <>
                    <div
                      className="w-4 h-4
                                 border-2
                                 border-white
                                 border-t-transparent
                                 rounded-full
                                 animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
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
}) => {
  return (
    <div
      className="bg-white
                 rounded-2xl
                 border
                 border-slate-200
                 p-5"
    >

      <div
        className="flex
                   items-center
                   justify-between"
      >

        <div>

          <p
            className="text-sm
                       text-slate-500"
          >
            {title}
          </p>

          <p
            className="text-2xl
                       font-bold
                       text-slate-900
                       mt-2"
          >
            {value}
          </p>

        </div>

        <div
          className="p-3
                     rounded-xl
                     bg-blue-50
                     text-blue-600"
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default Interests;