import "server-only";

const GEO_API_BASE = "https://geo.api.gouv.fr";

async function getCoordinatesForPostalCode(
  postalCode: string,
): Promise<[number, number] | null> {
  const url = `${GEO_API_BASE}/communes?codePostal=${encodeURIComponent(postalCode)}&fields=centre&limit=1`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const communes: { centre?: { coordinates: [number, number] } }[] =
    await res.json();
  const centre = communes[0]?.centre;
  if (!centre) return null;
  // GeoJSON coordinates are [longitude, latitude]
  return [centre.coordinates[1], centre.coordinates[0]];
}

export async function getPostalCodesNearby(
  postalCode: string,
  radiusMeters: number = 30000,
): Promise<string[]> {
  try {
    const coords = await getCoordinatesForPostalCode(postalCode);
    if (!coords) return [postalCode];

    const [lat, lon] = coords;
    const url = `${GEO_API_BASE}/communes?lat=${lat}&lon=${lon}&distance=${radiusMeters}&fields=codesPostaux`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [postalCode];

    const communes: { codesPostaux?: string[] }[] = await res.json();
    const codes = communes.flatMap((c) => c.codesPostaux ?? []);
    return codes.length > 0 ? [...new Set(codes)] : [postalCode];
  } catch {
    return [postalCode];
  }
}
