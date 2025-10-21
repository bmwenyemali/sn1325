import { useEffect, useState } from "react";

interface LMA {
  _id: string;
  nom: string;
  type: {
    _id: string;
    nom: string;
  };
  description?: string;
  annee?: number;
  reference?: string;
  lien?: string;
  statut?: string;
}

export function useLoisMesuresActions() {
  const [loisMesuresActions, setLoisMesuresActions] = useState<LMA[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/lois-mesures-actions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLoisMesuresActions(data);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching LMMA:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loisMesuresActions,
    isLoading,
    isError,
    mutate: fetchData,
  };
}
