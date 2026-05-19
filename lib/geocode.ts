export async function geocodeAddress(
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null,
): Promise<{ latitude: number; longitude: number } | null> {
  const parts = [address, postalCode, city].filter(Boolean);
  if (parts.length === 0) return null;

  const q = encodeURIComponent(parts.join(' '));
  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${q}&limit=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data?.features?.[0];
    if (!feature) return null;
    const [longitude, latitude] = feature.geometry.coordinates;
    return { latitude, longitude };
  } catch {
    return null;
  }
}
