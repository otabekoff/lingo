"use client";

import { useEffect, useState } from "react";

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) return null;

  return <>{children}</>;
};
