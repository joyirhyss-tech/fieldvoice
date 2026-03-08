'use client';

import { useLocalStorage } from './useLocalStorage';
import { AgencyDocument, AgencyDocCategory } from './types';

const STORAGE_KEY = 'fieldvoices-agency-documents';

export function useDocumentStore() {
  const [documents, setDocuments] = useLocalStorage<AgencyDocument[]>(STORAGE_KEY, []);

  const addDocument = (doc: AgencyDocument) => {
    setDocuments((prev) => {
      // Replace existing doc in the same category (one doc per slot)
      const filtered = prev.filter((d) => d.category !== doc.category);
      return [...filtered, doc];
    });
  };

  const removeDocument = (category: AgencyDocCategory) => {
    setDocuments((prev) => prev.filter((d) => d.category !== category));
  };

  const getByCategory = (category: AgencyDocCategory): AgencyDocument | undefined => {
    return documents.find((d) => d.category === category);
  };

  const getContentByCategory = (category: AgencyDocCategory): string => {
    return documents.find((d) => d.category === category)?.content || '';
  };

  /** Build a combined context string from all uploaded documents for LLM prompts */
  const buildDocumentContext = (): string => {
    if (documents.length === 0) return '';
    return documents
      .map((d) => `[${d.label}]\n${d.content}`)
      .join('\n\n---\n\n');
  };

  return {
    documents,
    addDocument,
    removeDocument,
    getByCategory,
    getContentByCategory,
    buildDocumentContext,
  };
}

/** Static reader for components that can't use hooks (e.g., inside callbacks) */
export function readDocumentsFromStorage(): AgencyDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getDocumentContentByCategory(category: AgencyDocCategory): string {
  const docs = readDocumentsFromStorage();
  return docs.find((d) => d.category === category)?.content || '';
}
