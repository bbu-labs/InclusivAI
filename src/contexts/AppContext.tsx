"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { AppState, InputMethod, ApiDocument, AnalysisDisplay } from "@/types";

interface AppContextType {
  state: AppState;
  setInputMethod: (method: InputMethod) => void;
  setRawInput: (input: string, fileName?: string) => void;
  setDocumentId: (id: string) => void;
  setAnalysisId: (id: string) => void;
  setDocument: (doc: ApiDocument) => void;
  setAnalysisDisplay: (display: AnalysisDisplay) => void;
  reset: () => void;
}

const initialState: AppState = {
  inputMethod: null,
  rawInput: null,
  fileName: null,
  documentId: null,
  analysisId: null,
  document: null,
  analysisDisplay: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setInputMethod = (method: InputMethod) => {
    setState((prev) => ({ ...prev, inputMethod: method }));
  };

  const setRawInput = (input: string, fileName?: string) => {
    setState((prev) => ({ ...prev, rawInput: input, fileName: fileName || null }));
  };

  const setDocumentId = (id: string) => {
    setState((prev) => ({ ...prev, documentId: id }));
  };

  const setAnalysisId = (id: string) => {
    setState((prev) => ({ ...prev, analysisId: id }));
  };

  const setDocument = (doc: ApiDocument) => {
    setState((prev) => ({ ...prev, document: doc, documentId: doc.id }));
  };

  const setAnalysisDisplay = (display: AnalysisDisplay) => {
    setState((prev) => ({ ...prev, analysisDisplay: display, analysisId: display.analysisId }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setInputMethod,
        setRawInput,
        setDocumentId,
        setAnalysisId,
        setDocument,
        setAnalysisDisplay,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
