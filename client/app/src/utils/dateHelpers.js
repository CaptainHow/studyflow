export function formatISOToMMDDYYYY(iso) {
  if (!iso) return "";
  const [yyyy, mm, dd] = iso.split("-");
  if (!yyyy || !mm || !dd) return "";
  return `${mm}/${dd}/${yyyy}`;
}

export function parseISODate(iso) {
  if (!iso) return null;
  const [yyyyRaw, mmRaw, ddRaw] = iso.split("-");
  const yyyy = Number(yyyyRaw);
  const mm = Number(mmRaw);
  const dd = Number(ddRaw);
  if (!yyyy || !mm || !dd) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}
