export type Review = { id: string; author: string; anonymous: boolean; rating: number; text: string; date: string; verified: boolean };
export type Incident = { id: string; type: "Pests" | "Outage" | "Leak" | "Heat/AC" | "Security"; text: string; date: string; status: "Reported" | "Acknowledged" | "In progress" | "Resolved"; response?: string };
export type Listing = {
  id: string; title: string; address: string; neighborhood: string; rent: number; beds: number; baths: number;
  layout: string; milesToCampus: number; transitMin: number; walkMin: number; transitLine: string;
  utilities: number; parking: number; deposit: number; appFee: number; insurance: number; amenityFee: number;
  verifiedLandlord: boolean; verifiedOwnership: boolean; available: string; furnished: boolean; petFriendly: boolean;
  laundry: "In-unit" | "Building" | "None"; vibe: string[]; image: string; landlord: string;
  reviews: Review[]; incidents: Incident[]; x: number; y: number;
};
const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;
export const listings: Listing[] = [
  { id: "ledroit-1", title: "LeDroit Park Rowhouse Suite", address: "418 T St NW", neighborhood: "LeDroit Park", rent: 1150, beds: 1, baths: 1, layout: "Private room in 4BR", milesToCampus: 0.3, transitMin: 6, walkMin: 7, transitLine: "Walk", utilities: 85, parking: 0, deposit: 1150, appFee: 50, insurance: 12, amenityFee: 0, verifiedLandlord: true, verifiedOwnership: true, available: "2027-06-01", furnished: true, petFriendly: false, laundry: "In-unit", vibe: ["Quiet", "Historic", "Walkable"], image: img("photo-1570129477492-45c003edd2be"), landlord: "Bannister Homes",
    reviews: [
      { id: "r1", author: "Class of '26", anonymous: true, rating: 5, text: "Five-minute walk to Founders Library. Landlord fixed the dryer same day.", date: "2026-05-02", verified: true },
      { id: "r2", author: "Jordan M.", anonymous: false, rating: 4, text: "Great location and quiet block. Rooms are small but well kept.", date: "2026-03-19", verified: true },
    ], incidents: [{ id: "i1", type: "Heat/AC", text: "Radiator not heating 2nd floor", date: "2026-01-12", status: "Resolved", response: "Valve replaced within 48 hours." }], x: 48, y: 40 },
  { id: "uptown-2", title: "The Lofts on Georgia", address: "2800 Georgia Ave NW", neighborhood: "Pleasant Plains", rent: 1625, beds: 1, baths: 1, layout: "Studio", milesToCampus: 0.6, transitMin: 9, walkMin: 13, transitLine: "70 Bus", utilities: 120, parking: 150, deposit: 1625, appFee: 75, insurance: 15, amenityFee: 65, verifiedLandlord: true, verifiedOwnership: true, available: "2027-07-15", furnished: false, petFriendly: true, laundry: "In-unit", vibe: ["Modern", "Gym", "Social"], image: img("photo-1545324418-cc1a3fa10c00"), landlord: "Georgia Ave Residential",
    reviews: [
      { id: "r3", author: "Anonymous resident", anonymous: true, rating: 3, text: "Nice finishes, but the $65 amenity fee wasn't mentioned on the tour. Elevator out twice this semester.", date: "2026-04-11", verified: true },
      { id: "r4", author: "Taylor R.", anonymous: false, rating: 4, text: "Gym and study lounge are great. Packages sometimes go missing.", date: "2026-02-08", verified: true },
    ], incidents: [
      { id: "i2", type: "Outage", text: "Elevator outage, 3 days", date: "2026-09-22", status: "In progress", response: "Part ordered; ETA Friday." },
      { id: "i3", type: "Security", text: "Package room door left propped", date: "2026-10-03", status: "Acknowledged" },
    ], x: 40, y: 28 },
  { id: "shaw-3", title: "Shaw 3BR Share", address: "1520 9th St NW", neighborhood: "Shaw", rent: 1050, beds: 1, baths: 1, layout: "Private room in 3BR", milesToCampus: 1.4, transitMin: 14, walkMin: 28, transitLine: "Green/Yellow Line", utilities: 70, parking: 0, deposit: 1050, appFee: 40, insurance: 12, amenityFee: 0, verifiedLandlord: true, verifiedOwnership: false, available: "2027-06-01", furnished: false, petFriendly: true, laundry: "Building", vibe: ["Nightlife", "Restaurants", "Social"], image: img("photo-1502672260266-1c1ef2d93688"), landlord: "Private owner",
    reviews: [
      { id: "r5", author: "Anonymous", anonymous: true, rating: 2, text: "Mice in the kitchen all winter. Owner slow to respond.", date: "2026-02-28", verified: true },
      { id: "r6", author: "Chris O.", anonymous: false, rating: 3, text: "Unbeatable food scene. Building laundry often broken.", date: "2025-12-10", verified: false },
    ], incidents: [
      { id: "i4", type: "Pests", text: "Mice sightings in kitchen", date: "2026-02-15", status: "Reported" },
      { id: "i5", type: "Leak", text: "Bathroom ceiling leak", date: "2026-08-04", status: "Resolved", response: "Roof flashing repaired." },
    ], x: 60, y: 68 },
  { id: "columbia-4", title: "Columbia Heights 2BR", address: "3100 14th St NW", neighborhood: "Columbia Heights", rent: 1400, beds: 2, baths: 1, layout: "2BR (per-person)", milesToCampus: 1.1, transitMin: 12, walkMin: 22, transitLine: "Green Line", utilities: 95, parking: 100, deposit: 700, appFee: 50, insurance: 14, amenityFee: 0, verifiedLandlord: true, verifiedOwnership: true, available: "2027-08-01", furnished: false, petFriendly: false, laundry: "In-unit", vibe: ["Shopping", "Transit hub", "Diverse"], image: img("photo-1522708323590-d24dbb6b0267"), landlord: "Tivoli Property Group",
    reviews: [
      { id: "r7", author: "Morgan K.", anonymous: false, rating: 5, text: "Metro is 2 blocks away. Manager responds within a day.", date: "2026-06-01", verified: true },
    ], incidents: [], x: 25, y: 18 },
  { id: "brookland-5", title: "Brookland Garden Apartment", address: "1004 Monroe St NE", neighborhood: "Brookland", rent: 975, beds: 1, baths: 1, layout: "Basement 1BR", milesToCampus: 2.3, transitMin: 22, walkMin: 45, transitLine: "Red Line + H8", utilities: 60, parking: 0, deposit: 975, appFee: 35, insurance: 10, amenityFee: 0, verifiedLandlord: false, verifiedOwnership: false, available: "2027-05-15", furnished: true, petFriendly: true, laundry: "Building", vibe: ["Quiet", "Green space", "Budget"], image: img("photo-1484154218962-a197022b5858"), landlord: "Unverified poster",
    reviews: [{ id: "r8", author: "Anonymous", anonymous: true, rating: 4, text: "Cheapest place I found. Commute is long on weekends.", date: "2026-01-20", verified: false }], incidents: [], x: 85, y: 22 },
  { id: "uSt-6", title: "U Street Corridor 1BR", address: "1900 12th St NW", neighborhood: "U Street", rent: 1850, beds: 1, baths: 1, layout: "1BR", milesToCampus: 0.9, transitMin: 10, walkMin: 18, transitLine: "Green Line", utilities: 110, parking: 175, deposit: 1850, appFee: 60, insurance: 15, amenityFee: 40, verifiedLandlord: true, verifiedOwnership: true, available: "2027-06-15", furnished: false, petFriendly: true, laundry: "In-unit", vibe: ["Nightlife", "Music", "Walkable"], image: img("photo-1493809842364-78817add7ffb"), landlord: "Lincoln Realty",
    reviews: [{ id: "r9", author: "Sam P.", anonymous: false, rating: 4, text: "Love the neighborhood. Weekend noise can be a lot.", date: "2026-05-30", verified: true }], incidents: [{ id: "i6", type: "Outage", text: "Hot water out 1 day", date: "2026-10-20", status: "Resolved", response: "Water heater serviced." }], x: 52, y: 58 },
];
export const getListing = (id: string) => listings.find((l) => l.id === id);

export function monthlyTotal(l: Listing, opts: { parking?: boolean; transit?: boolean } = {}) {
  const transit = opts.transit ?? true ? (l.walkMin <= 10 ? 0 : 64) : 0;
  return l.rent + l.utilities + (opts.parking ? l.parking : 0) + transit + l.insurance + l.amenityFee;
}
export function moveInCost(l: Listing) { return l.deposit + l.appFee + l.rent; }
export function avgRating(l: Listing) { return l.reviews.length ? l.reviews.reduce((a, r) => a + r.rating, 0) / l.reviews.length : 0; }

export type Prefs = { budget: number; maxCommute: number; mustFurnished: boolean; mustPets: boolean; wQuiet: number; wCost: number; wCommute: number; wCondition: number };
export const defaultPrefs: Prefs = { budget: 1500, maxCommute: 20, mustFurnished: false, mustPets: false, wQuiet: 3, wCost: 5, wCommute: 4, wCondition: 4 };

export function matchScore(l: Listing, p: Prefs) {
  const reasons: string[] = []; const blockers: string[] = [];
  const total = monthlyTotal(l);
  if (p.mustFurnished && !l.furnished) blockers.push("Not furnished");
  if (p.mustPets && !l.petFriendly) blockers.push("No pets allowed");
  if (l.transitMin > p.maxCommute) blockers.push(`Commute ${l.transitMin} min > ${p.maxCommute} min`);
  const cost = Math.max(0, Math.min(1, 1 - (total - p.budget * 0.7) / (p.budget * 0.6)));
  const commute = Math.max(0, 1 - l.transitMin / 30);
  const quiet = l.vibe.includes("Quiet") ? 1 : l.vibe.includes("Nightlife") ? 0.2 : 0.6;
  const unresolved = l.incidents.filter((i) => i.status !== "Resolved").length;
  const condition = Math.max(0, Math.min(1, avgRating(l) / 5 - unresolved * 0.15));
  const W = p.wCost + p.wCommute + p.wQuiet + p.wCondition || 1;
  let score = (cost * p.wCost + commute * p.wCommute + quiet * p.wQuiet + condition * p.wCondition) / W;
  if (cost > 0.7) reasons.push(`True cost $${total}/mo fits your $${p.budget} budget`);
  if (total > p.budget) reasons.push(`$${total - p.budget}/mo over budget`);
  if (commute > 0.6) reasons.push(`${l.transitMin}-min commute to campus`);
  if (quiet === 1 && p.wQuiet >= 3) reasons.push("Quiet area matches your preference");
  if (condition > 0.8) reasons.push("Strong resident reviews, few open issues");
  if (unresolved) reasons.push(`${unresolved} open maintenance issue${unresolved > 1 ? "s" : ""}`);
  if (blockers.length) score *= 0.35;
  return { score: Math.round(score * 100), reasons, blockers };
}

export function summarizeReviews(l: Listing) {
  const avg = avgRating(l);
  const text = l.reviews.map((r) => r.text.toLowerCase()).join(" ");
  const pos = ["walk", "great", "quiet", "responds", "fixed", "love", "metro", "gym", "cheap"].filter((w) => text.includes(w));
  const neg = ["mice", "fee", "noise", "outage", "elevator", "broken", "slow", "missing", "leak", "small"].filter((w) => text.includes(w));
  const sentiment = avg >= 4 ? "Positive" : avg >= 3 ? "Mixed" : "Negative";
  return { sentiment, avg, pos, neg };
}

export type Roommate = { id: string; name: string; major: string; year: string; sleep: number; clean: number; social: number; budget: number; guests: number; noise: number; bio: string };
export const roommates: Roommate[] = [
  { id: "a", name: "Aaliyah B.", major: "Biology", year: "Junior", sleep: 2, clean: 5, social: 2, budget: 1200, guests: 1, noise: 1, bio: "Pre-med, early riser, keeps a tidy kitchen." },
  { id: "b", name: "Marcus T.", major: "Computer Science", year: "Junior", sleep: 5, clean: 3, social: 4, budget: 1100, guests: 4, noise: 4, bio: "Night owl gamer, friendly, hosts study groups." },
  { id: "c", name: "Destiny W.", major: "Journalism", year: "Senior", sleep: 3, clean: 4, social: 3, budget: 1300, guests: 2, noise: 2, bio: "Works at The Hilltop, balanced schedule." },
  { id: "d", name: "Kofi A.", major: "Engineering", year: "Junior", sleep: 3, clean: 4, social: 2, budget: 1150, guests: 2, noise: 2, bio: "Quiet, cooks a lot, gym in the mornings." },
  { id: "e", name: "Imani J.", major: "Business", year: "Sophomore", sleep: 4, clean: 2, social: 5, budget: 1500, guests: 5, noise: 4, bio: "Event planner energy, loves having people over." },
  { id: "f", name: "Nia R.", major: "Psychology", year: "Junior", sleep: 2, clean: 5, social: 3, budget: 1250, guests: 2, noise: 1, bio: "Plant parent, studies at home, early sleeper." },
];
export type Me = Omit<Roommate, "id" | "name" | "major" | "year" | "bio">;
export const factors: { key: keyof Me; label: string; low: string; high: string; weight: number }[] = [
  { key: "sleep", label: "Sleep schedule", low: "Early bird", high: "Night owl", weight: 3 },
  { key: "clean", label: "Cleanliness", low: "Relaxed", high: "Spotless", weight: 3 },
  { key: "social", label: "Social energy", low: "Homebody", high: "Very social", weight: 2 },
  { key: "guests", label: "Guests over", low: "Rarely", high: "Often", weight: 2 },
  { key: "noise", label: "Noise tolerance", low: "Need quiet", high: "Don't mind", weight: 2 },
];
export function roommateScore(me: Me, r: Roommate) {
  let tot = 0, w = 0; const conflicts: string[] = []; const strengths: string[] = [];
  for (const f of factors) {
    const d = Math.abs((me[f.key] as number) - (r[f.key] as number));
    tot += (1 - d / 4) * f.weight; w += f.weight;
    if (d >= 3) conflicts.push(`${f.label}: likely friction (${f.low.toLowerCase()} vs ${f.high.toLowerCase()})`);
    else if (d === 0) strengths.push(`Same ${f.label.toLowerCase()}`);
  }
  const bd = Math.abs(me.budget - r.budget);
  const b = Math.max(0, 1 - bd / 500); tot += b * 3; w += 3;
  if (bd > 300) conflicts.push(`Budget gap of $${bd}/mo`); else if (bd <= 100) strengths.push("Similar budget");
  return { score: Math.round((tot / w) * 100), conflicts, strengths };
}

export const sampleLease = `RESIDENTIAL LEASE AGREEMENT
Term: 12 months beginning June 1, 2027. Monthly rent: $1,625 due on the 1st.
Late Fee: A late fee of $100 plus $15 per day will be charged if rent is received after the 3rd.
Security Deposit: $1,625, refundable within 45 days less deductions. Carpet cleaning fee of $250 is non-refundable.
Amenity Fee: Tenant agrees to pay a monthly amenity fee of $65.
Early Termination: Tenant may terminate early by paying two (2) months' rent as a lease break fee.
Automatic Renewal: This lease automatically renews for 12 months unless tenant gives 90 days written notice.
Utilities: Tenant is responsible for electricity, gas, and internet. Water billed via RUBS allocation.
Subletting: Subletting is prohibited without written landlord consent.
Guests: Guests staying more than 7 consecutive nights require landlord approval.
Maintenance: Tenant is responsible for repairs under $150.
Entry: Landlord may enter with 24 hours notice.`;

export type Clause = { title: string; text: string; risk: "high" | "medium" | "low"; note: string };
const rules: { re: RegExp; title: string; risk: Clause["risk"]; note: string }[] = [
  { re: /late fee/i, title: "Late fees", risk: "medium", note: "Daily late fees compound quickly — confirm the grace period." },
  { re: /non-refundable/i, title: "Non-refundable charges", risk: "high", note: "Money you will not get back regardless of condition." },
  { re: /amenity fee|admin fee|service fee/i, title: "Recurring fees", risk: "medium", note: "Adds to your true monthly cost beyond rent." },
  { re: /terminat|lease break/i, title: "Early termination", risk: "high", note: "Leaving early (e.g. study abroad) could cost months of rent." },
  { re: /automatic(ally)? renew/i, title: "Auto-renewal", risk: "high", note: "Set a calendar reminder for the notice deadline." },
  { re: /rubs|utilit/i, title: "Utilities", risk: "medium", note: "RUBS splits building water bills — costs can vary month to month." },
  { re: /sublet/i, title: "Subletting", risk: "medium", note: "Limits summer flexibility; ask about consent process." },
  { re: /guest/i, title: "Guest policy", risk: "low", note: "Relevant if family visits for long stretches." },
  { re: /repairs under|tenant is responsible for repair/i, title: "Repair responsibility", risk: "medium", note: "Small repairs come out of your pocket." },
  { re: /deposit/i, title: "Security deposit", risk: "low", note: "Document move-in condition with photos." },
  { re: /enter/i, title: "Landlord entry", risk: "low", note: "24-hour notice is standard." },
];
export function analyzeLease(text: string) {
  const lines = text.split(/\n|(?<=\.)\s+(?=[A-Z][a-z]+( [A-Z][a-z]+)?:)/).filter(Boolean).map((s) => s.trim()).filter((s) => s.length > 8);
  const clauses: Clause[] = [];
  for (const r of rules) { const line = lines.find((l) => r.re.test(l)); if (line) clauses.push({ title: r.title, text: line, risk: r.risk, note: r.note }); }
  const money = [...text.matchAll(/\$\d{1,3}(?:,\d{3})*/g)].map((m) => m[0]);
  return { clauses, money: [...new Set(money)] };
}
