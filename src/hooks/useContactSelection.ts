import { useState, useCallback, useRef, useEffect } from "react";

interface UseContactSelectionReturn {
  selectedIds: Set<string>;
  selectionOrder: string[];
  handleToggle: (id: string) => void;
}

export function useContactSelection(): UseContactSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  
  const selectedIdsRef = useRef(selectedIds);

  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  const handleToggle = useCallback((id: string) => {
    const isCurrentlySelected = selectedIdsRef.current.has(id);
    
    if (isCurrentlySelected) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setSelectionOrder((prevOrder) => prevOrder.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
      setSelectionOrder((prevOrder) => [...prevOrder, id]);
    }
  }, []);

  return {
    selectedIds,
    selectionOrder,
    handleToggle,
  };
}

