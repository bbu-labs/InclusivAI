"use client";

import { useState, useEffect } from "react";
import { apiGetQuestions, apiAskQuestion, ApiError } from "@/lib/api";
import type { ApiQuestion } from "@/types";
import { IoSend, IoChatbubbles } from "react-icons/io5";

const MAX_QUESTIONS_FREE = 5;

export default function QAPanel({ analysisId }: { analysisId: string }) {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGetQuestions(analysisId)
      .then(({ questions }) => setQuestions(questions))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, [analysisId]);

  const handleAsk = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const { question } = await apiAskQuestion(analysisId, input.trim());
      setQuestions((prev) => [...prev, question]);
      setInput("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao enviar pergunta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <IoChatbubbles className="text-primary" />
        Perguntas sobre a análise
      </h3>

      <p className="text-xs text-base-content/50 mb-4">
        {questions.length} de {MAX_QUESTIONS_FREE} perguntas
      </p>

      {/* Previous Q&A */}
      {loadingList ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm" />
        </div>
      ) : (
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <div className="bg-primary/10 rounded-xl p-3">
                <p className="text-sm font-medium">{q.question}</p>
              </div>
              <div className="bg-base-100 rounded-xl p-3">
                <p className="text-sm text-base-content/70">{q.answer}</p>
                {q.source_excerpt && (
                  <p className="text-xs text-base-content/40 mt-2 italic">
                    Fonte: &ldquo;{q.source_excerpt}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask input */}
      {questions.length < MAX_QUESTIONS_FREE && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Faça uma pergunta sobre o documento..."
            className="input input-bordered flex-1 input-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            disabled={loading}
          />
          <button
            className="btn btn-primary btn-sm btn-square"
            onClick={handleAsk}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <IoSend />
            )}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  );
}
