const requests = new Map<string, { count: number; lastReset: number }>();

const WINDOW = 60 * 1000; // 1 min
const LIMIT = 5;

export async function rateLimit(ip: string) {
  const now = Date.now();

  const record = requests.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > WINDOW) {
    record.count = 0;
    record.lastReset = now;
  }

  record.count += 1;
  requests.set(ip, record);

  return { success: record.count <= LIMIT };
}