"use client";

import {
    auth,
    db,
    doc,
    getDoc,
    getDownloadURL,
    ref,
    storage,
    updateProfile,
    uploadBytes,
} from "@/lib/firebase";
import type { Auth } from "firebase/auth";
import { onAuthStateChanged, signOut, updateEmail } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// --- Reusable UI Components for the New Layout ---

const SettingsSection = ({
  title,
  description,
  children,
  isLast = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <div className={`py-8 ${!isLast ? "border-b border-gray-200/70" : ""}`}>
    <div className="max-w-2xl">
      <h3 className="text-[15px] font-semibold text-[#111827] mb-1">{title}</h3>
      <p className="text-[14px] text-gray-500 mb-5">{description}</p>
      {children}
    </div>
  </div>
);

const StaticInput = ({
  value,
}: {
  value: string | number | null | undefined;
}) => (
  <div className="bg-[#f3f4f6] text-[#111827] text-[14px] px-4 py-2.5 rounded-lg w-full max-w-md font-medium h-10 flex items-center">
    {value || "Not provided"}
  </div>
);

const EditableInput = ({
  value,
  onSave,
  label,
}: {
  value: string | number | null | undefined;
  onSave: (newValue: string) => Promise<void>;
  label?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ""));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(String(value || ""));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          className="flex-1 bg-white border border-gray-300 text-[#111827] text-[14px] px-4 py-2.5 rounded-lg font-medium h-10 focus:outline-none focus:border-gray-500"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="h-10 px-4 py-2 bg-[#111827] text-white rounded-lg text-[14px] font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="h-10 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[14px] font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <StaticInput value={value} />
      <button
        onClick={() => setIsEditing(true)}
        className="h-10 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors whitespace-nowrap"
      >
        Edit
      </button>
    </div>
  );
};

const SkeletonLayout = () => (
  <div className="w-full flex flex-col pt-8">
    <div className="h-10 bg-gray-200 rounded-md w-48 mb-8 shimmer" />
    <div className="flex gap-6 mb-8 border-b border-gray-200/70 pb-3">
      <div className="h-5 bg-gray-200 rounded w-16 shimmer" />
      <div className="h-5 bg-gray-200 rounded w-24 shimmer" />
      <div className="h-5 bg-gray-200 rounded w-16 shimmer" />
    </div>
    <div className="py-8 border-b border-gray-200/70">
      <div className="h-5 bg-gray-200 rounded w-24 mb-2 shimmer" />
      <div className="h-4 bg-gray-200 rounded w-64 mb-6 shimmer" />
      <div className="w-24 h-24 bg-gray-200 rounded-2xl shimmer" />
    </div>
    <div className="py-8 border-b border-gray-200/70">
      <div className="h-5 bg-gray-200 rounded w-32 mb-2 shimmer" />
      <div className="h-4 bg-gray-200 rounded w-72 mb-6 shimmer" />
      <div className="h-10 bg-gray-200 rounded-lg max-w-md shimmer" />
    </div>
  </div>
);

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [userCreatedDate, setUserCreatedDate] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active tab state (mostly visual for this implementation)
  const [activeTab, setActiveTab] = useState("Account");

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      if (!user) {
        router.replace("/sign-in?next=/account");
        return;
      }
      setUserEmail(user.email);
      setUserName(user.displayName);
      setUserPhotoURL(user.photoURL);
      if (user.metadata?.creationTime) {
        const createdDate = new Date(user.metadata.creationTime);
        setUserCreatedDate(
          createdDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        );
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!auth?.currentUser || !db) return;
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setOnboardingData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    if (authReady) fetchOnboardingData();
  }, [authReady]);

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth?.currentUser || !storage) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      const user = auth.currentUser;
      const fileRef = ref(
        storage,
        `avatars/${user.uid}/${Date.now()}_${file.name}`,
      );

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await updateProfile(user, { photoURL: downloadURL });
      setUserPhotoURL(downloadURL);

      // Also update Firestore user document
      if (db) {
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveName = async (newName: string) => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", auth.currentUser.uid), { name: newName });
    await updateProfile(auth.currentUser, { displayName: newName });
    setUserName(newName);
  };

  const handleSaveInstitution = async (newSchool: string) => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      school: newSchool,
    });
    setOnboardingData((prev: any) => ({ ...prev, school: newSchool }));
  };

  const handleSaveRole = async (newRole: string) => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      role: newRole.toLowerCase(),
    });
    setOnboardingData((prev: any) => ({
      ...prev,
      role: newRole.toLowerCase(),
    }));
  };

  const handleSaveGraduationYear = async (newYear: string) => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      graduationYear: newYear,
    });
    setOnboardingData((prev: any) => ({ ...prev, graduationYear: newYear }));
  };

  const handleSaveTopScore = async (newScore: string) => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      bestTotalScore: parseInt(newScore) || null,
    });
    setOnboardingData((prev: any) => ({
      ...prev,
      bestTotalScore: parseInt(newScore) || null,
    }));
  };

  const handleSaveTargetScore = async (newScore: string) => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      goalScore: parseInt(newScore) || null,
    });
    setOnboardingData((prev: any) => ({
      ...prev,
      goalScore: parseInt(newScore) || null,
    }));
  };

  const handleEmailUpdate = async () => {
    const newEmail = prompt("Enter your new email address:");
    if (!newEmail || !auth?.currentUser) return;
    try {
      await updateEmail(auth.currentUser, newEmail);
      setUserEmail(newEmail);
      alert(
        "Email updated successfully. Please check your inbox for verification.",
      );
    } catch (error: any) {
      console.error("Email update error:", error);
      alert(error.message || "Failed to update email. Please try again.");
    }
  };

  const handleDownloadData = async () => {
    if (!auth?.currentUser || !db) return;
    try {
      const { getDocs, collection } = await import("firebase/firestore");
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const progressSnap = await getDocs(
        collection(db, "users", auth.currentUser.uid, "progress"),
      );

      const data = {
        profile: userDoc.data(),
        progress: progressSnap.docs.map((doc) => doc.data()),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moriprep-data-${auth.currentUser.uid}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download data. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.",
    );
    if (!confirmed || !auth?.currentUser || !db) return;

    const doubleConfirmed = window.confirm(
      "This is your last chance. Type 'DELETE' to confirm account deletion.",
    );
    if (!doubleConfirmed) return;

    try {
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await auth.currentUser.delete();
      router.push("/");
    } catch (error: any) {
      console.error("Delete account error:", error);
      if (error.code === "auth/requires-recent-login") {
        alert(
          "You need to re-login to delete your account for security reasons.",
        );
      } else {
        alert(error.message || "Failed to delete account. Please try again.");
      }
    }
  };

  const handleFAQ = () => {
    window.open("https://moriprep.xyz/faq", "_blank");
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@moriprep.xyz";
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent("Bug Report - Mori Prep");
    const body = encodeURIComponent(
      "Please describe the bug you encountered:\n\n" +
        "Steps to reproduce:\n\n" +
        "Expected behavior:\n\n" +
        "Actual behavior:\n\n",
    );
    window.location.href = `mailto:support@moriprep.xyz?subject=${subject}&body=${body}`;
  };

  const handleFeatureRequest = () => {
    const subject = encodeURIComponent("Feature Request - Mori Prep");
    const body = encodeURIComponent(
      "Please describe the feature you'd like to see:\n\n" +
        "Why would this feature be useful?\n\n",
    );
    window.location.href = `mailto:support@moriprep.xyz?subject=${subject}&body=${body}`;
  };

  const tabs = ["Account", "Data & Privacy", "Help & Support"];

  return (
    <div className="min-h-screen w-full bg-[#fafafa] sm:bg-white text-[#111827] font-sans selection:bg-gray-200 selection:text-black flex flex-col items-center">
      {/* Top Navigation (Preserved exactly as requested) */}
      <div className="w-full bg-white/80 backdrop-blur-xl flex justify-center sticky top-0 z-50 border-b border-black/5">
        <div className="w-full max-w-3xl px-6 py-3 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-[17px] font-medium text-[#8e8e93] hover:text-[#2c2c2e] active:scale-95 transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Link
            href="/"
            className="flex items-center h-6 hover:opacity-70 transition-opacity"
          >
            <img
              src="/morin.svg"
              alt="Sainto Logo"
              className="h-full w-auto object-contain opacity-80"
            />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[800px] px-6 sm:px-10 pt-10 pb-24 flex-1">
        <AnimatePresence mode="wait">
          {loadingProfile ? (
            <motion.div
              key="profile-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLayout />
            </motion.div>
          ) : (
            <motion.div
              key="profile-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Header */}
              <h1 className="text-[32px] font-semibold tracking-tight text-[#111827] mb-8">
                Settings
              </h1>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200/70 mb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden -mx-6 px-6 sm:mx-0 sm:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-2 py-2 text-[14px] font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? "text-[#111827]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111827]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Content Sections */}
              <div className="flex flex-col">
                {/* Account Tab */}
                {activeTab === "Account" && (
                  <>
                    <SettingsSection
                      title="Avatar"
                      description="Choose how your profile is displayed."
                    >
                      <div className="flex flex-col gap-3">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm bg-[#111827] flex items-center justify-center group">
                          {userPhotoURL ? (
                            <img
                              src={userPhotoURL}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-3xl font-medium tracking-tight">
                              {userName
                                ? userName.substring(0, 2).toUpperCase()
                                : "U"}
                            </span>
                          )}

                          {/* Upload Badge */}
                          <motion.button
                            onClick={handleUploadClick}
                            disabled={uploadingPhoto}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <AnimatePresence mode="wait">
                              {uploadingPhoto ? (
                                <motion.svg
                                  key="loading"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  className="animate-spin"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </motion.svg>
                              ) : (
                                <motion.svg
                                  key="upload"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </motion.svg>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <p className="text-[13px] text-gray-500">
                          We recommend a size of at least 256x256 px. Max 5MB.
                        </p>
                      </div>
                    </SettingsSection>

                    <SettingsSection
                      title="Account Name"
                      description="Visible to you and invited members of your workspace."
                    >
                      <EditableInput value={userName} onSave={handleSaveName} />
                    </SettingsSection>

                    <SettingsSection
                      title="Account Email"
                      description="Manage the email you use to sign in and receive updates."
                    >
                      <div className="flex items-center gap-3">
                        <StaticInput value={userEmail} />
                        <button
                          onClick={handleEmailUpdate}
                          className="h-10 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors whitespace-nowrap"
                        >
                          Update
                        </button>
                      </div>
                    </SettingsSection>

                    {onboardingData?.school && (
                      <SettingsSection
                        title="Institution"
                        description="The primary school or institution you are currently attending."
                      >
                        <EditableInput
                          value={onboardingData.school}
                          onSave={handleSaveInstitution}
                        />
                      </SettingsSection>
                    )}

                    {(onboardingData?.role ||
                      onboardingData?.graduationYear) && (
                      <SettingsSection
                        title="Academic Details"
                        description="Your current academic status and expected graduation."
                      >
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                          <div className="flex-1">
                            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                              Role
                            </label>
                            <EditableInput
                              value={
                                onboardingData.role
                                  ? onboardingData.role
                                      .charAt(0)
                                      .toUpperCase() +
                                    onboardingData.role.slice(1)
                                  : null
                              }
                              onSave={handleSaveRole}
                            />
                          </div>
                          <div className="flex-[2]">
                            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                              Graduation Year
                            </label>
                            <EditableInput
                              value={onboardingData.graduationYear}
                              onSave={handleSaveGraduationYear}
                            />
                          </div>
                        </div>
                      </SettingsSection>
                    )}

                    {(onboardingData?.bestTotalScore ||
                      onboardingData?.goalScore) && (
                      <SettingsSection
                        title="Test Scores"
                        description="Your current standing and target goals for standardized testing."
                      >
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                          <div className="flex-1">
                            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                              Top Score
                            </label>
                            <EditableInput
                              value={onboardingData.bestTotalScore}
                              onSave={handleSaveTopScore}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                              Target Score
                            </label>
                            <EditableInput
                              value={onboardingData.goalScore}
                              onSave={handleSaveTargetScore}
                            />
                          </div>
                        </div>
                      </SettingsSection>
                    )}

                    <SettingsSection
                      title="Session Management"
                      description="Log out of your account on this device."
                      isLast={true}
                    >
                      <button
                        onClick={handleLogout}
                        className="h-10 px-5 py-2 bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg text-[14px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
                      >
                        Log out
                      </button>
                    </SettingsSection>
                  </>
                )}

                {/* Data & Privacy Tab */}
                {activeTab === "Data & Privacy" && (
                  <div className="flex flex-col">
                    <SettingsSection
                      title="Download Your Data"
                      description="Get a copy of all your practice data and progress."
                    >
                      <button
                        onClick={handleDownloadData}
                        className="h-10 px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                      >
                        Download Data
                      </button>
                    </SettingsSection>

                    <SettingsSection
                      title="Delete Account"
                      description="Permanently delete your account and all associated data."
                    >
                      <button
                        onClick={handleDeleteAccount}
                        className="h-10 px-5 py-2 bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-lg text-[14px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                      >
                        Delete Account
                      </button>
                    </SettingsSection>

                    <SettingsSection
                      title="Privacy Settings"
                      description="Manage your privacy preferences."
                      isLast={true}
                    >
                      <StaticInput value="Standard privacy settings" />
                    </SettingsSection>
                  </div>
                )}

                {/* Help & Support Tab */}
                {activeTab === "Help & Support" && (
                  <div className="flex flex-col">
                    <SettingsSection
                      title="FAQ"
                      description="Find answers to commonly asked questions."
                    >
                      <button
                        onClick={handleFAQ}
                        className="h-10 px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                      >
                        View FAQ
                      </button>
                    </SettingsSection>

                    <SettingsSection
                      title="Contact Support"
                      description="Get help from our support team."
                    >
                      <button
                        onClick={handleContactSupport}
                        className="h-10 px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                      >
                        Contact Support
                      </button>
                    </SettingsSection>

                    <SettingsSection
                      title="Report a Bug"
                      description="Let us know if something isn't working right."
                    >
                      <button
                        onClick={handleReportBug}
                        className="h-10 px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                      >
                        Report Bug
                      </button>
                    </SettingsSection>

                    <SettingsSection
                      title="Feature Requests"
                      description="Suggest new features or improvements."
                      isLast={true}
                    >
                      <button
                        onClick={handleFeatureRequest}
                        className="h-10 px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                      >
                        Submit Request
                      </button>
                    </SettingsSection>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
