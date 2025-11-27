"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import DatasetUploader from "@/components/DatasetUploader";

export default function TrainPage() {
  const { user, loadingUser } = useCurrentUser();

  if (loadingUser) return null;
  if (!user) return null;

  return (
    <div
      className="
        w-full
        min-h-[calc(100vh-120px)]
        flex items-start justify-center
        px-3 sm:px-6
        py-10
      "
    >
      <div
        className="
          w-full
          max-w-3xl
          glass
          rounded-xl
          p-4 sm:p-6 md:p-8
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-accent mb-2 text-center">
          Train a New Dataset
        </h1>

        <p className="text-sm text-muted mb-6 text-center">
          Upload your dataset (CSV file with features and labels) and start
          training machine learning models automatically.
        </p>

        <DatasetUploader />
      </div>
    </div>
  );
}
