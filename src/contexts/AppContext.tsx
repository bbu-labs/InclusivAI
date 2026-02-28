"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AppState, InputMethod, DocumentType, AnalysisResult } from "@/types";

interface AppContextType {
  state: AppState;
  setInputMethod: (method: InputMethod) => void;
  setRawInput: (input: string, fileName?: string) => void;
  setExtractedText: (text: string) => void;
  setDocumentType: (type: DocumentType) => void;
  confirmDocument: () => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  reset: () => void;
}

const initialState: AppState = {
  inputMethod: null,
  rawInput: null,
  fileName: null,
  extractedText: null,
  documentType: null,
  isConfirmed: false,
  analysisResult: null,
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

  const setExtractedText = (text: string) => {
    setState((prev) => ({ ...prev, extractedText: text }));
  };

  const setDocumentType = (type: DocumentType) => {
    setState((prev) => ({ ...prev, documentType: type }));
  };

  const confirmDocument = () => {
    setState((prev) => ({ ...prev, isConfirmed: true }));
  };

  const setAnalysisResult = (result: AnalysisResult) => {
    setState((prev) => ({ ...prev, analysisResult: result }));
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
        setExtractedText,
        setDocumentType,
        confirmDocument,
        setAnalysisResult,
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
