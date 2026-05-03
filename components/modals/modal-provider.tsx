"use client";

import { ExitModal } from "./exit-modal";
import { HeartsModal } from "./hearts-modal";
import { PracticeModal } from "./practice-modal";

export const ModalProvider = () => {
  return (
    <>
      <ExitModal />
      <HeartsModal />
      <PracticeModal />
    </>
  );
};
