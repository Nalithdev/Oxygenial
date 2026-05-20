import { useEffect, useState } from "react";
import { orpcClient } from "@/lib/orpc-client";
import { useMutation } from "@tanstack/react-query";

export type CompanyInfoAPI = {
  nom_complet: string;
  siege: {
    code_postal: string;
    libelle_commune: string;
    adresse: string;
  };
};

type ResponseApi = {
  results: CompanyInfoAPI[];
};

export type CompanyInfo = {
  name: string;
  postalNumber: string;
  city: string;
  adress: string;
  nbOfEmployees: string;
};

export function useCompanyDetails(onSuccess: () => void) {
  const [error, setError] = useState<string | null>(null);
  const [siretCache, setSiretCache] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    siret: "",
    address: "",
    postalCode: "",
    city: "",
    sector: "",
    employeeCount: "",
  });

  async function getCompanyInfo(siret: string): Promise<void> {
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${siret}`;
    try {
      const response = (await fetch(url).then((response) =>
        response.json(),
      )) as ResponseApi;

      if (response.results.length === 0) {
        setError("Entreprise pas trouvée");
        return;
      }
      const result = response.results[0];

      setFormData((prev) => ({
        ...prev,
        // Si l'API renvoie null, on garde ce qu'il y a déjà dans prev.name,
        // sinon on met une chaîne vide pour éviter le composant non-contrôlé
        name: result.nom_complet || prev.name || "",
        address: result.siege.adresse || prev.address || "",
        postalCode: result.siege.code_postal || prev.postalCode || "",
        city: result.siege.libelle_commune || prev.city || "",
      }));
    } catch (error) {
      setError("Entreprise pas trouvée");
    }
  }

  useEffect(() => {
    if (formData.siret === siretCache?.toString()) {
      return;
    }
    if (siretCache !== siretCache?.toString() && siretCache !== "") {
      setSiretCache(null);
    }
    if (formData.siret.length === 14 || formData.siret.length === 9) {
      setSiretCache(formData.siret);
      getCompanyInfo(formData.siret);
    }
  }, [formData, siretCache]);

  const createCompanyMutation = useMutation({
    mutationFn: async () => {
      return orpcClient.clientCompany.create({
        name: formData.name,
        siret: formData.siret || undefined,
        address: formData.address || undefined,
        postalCode: formData.postalCode || undefined,
        city: formData.city || undefined,
        sector: formData.sector || undefined,
        employeeCount: formData.employeeCount
          ? parseInt(formData.employeeCount)
          : undefined,
      });
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  function handleSubmit() {
    event.preventDefault();
    console.log(formData);

    setError(null);

    if (!formData.name) {
      setError("Le nom de l'entreprise est requis");
      return;
    }

    createCompanyMutation.mutate();
  }

  return {
    handleSubmit,
    error,
    formData,
    setFormData,
    createCompanyMutation,
  };
}
