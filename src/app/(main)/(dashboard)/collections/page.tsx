"use client";

import { useSession } from "next-auth/react";

const CollectionsPage = () => {
  const { data: session } = useSession();
  const areaCode = session?.user?.name || "Not assigned";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        This is the Collection Page of the Enumerator
      </h1>
      <p className="text-lg text-gray-600">
        Your Area Code: <span className="font-semibold">{areaCode}</span>
      </p>
    </div>
  );
};

export default CollectionsPage;
