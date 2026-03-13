import type { VercelRequest, VercelResponse } from "@vercel/node";

// Zoom Server-to-Server OAuth でアクセストークンを取得
async function getZoomAccessToken(): Promise<string> {
  const accountId  = process.env.ZOOM_ACCOUNT_ID;
  const clientId   = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom API の環境変数が設定されていません");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Zoom トークン取得失敗: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// Zoom ミーティングを作成して join_url を返す
async function createMeeting(
  token: string,
  topic: string,
  startTime: string, // ISO 8601
  durationMin: number
): Promise<{ join_url: string; password: string; meeting_id: string }> {
  const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      type: 2,                    // 2 = スケジュールミーティング
      start_time: startTime,
      duration: durationMin,
      timezone: "Asia/Tokyo",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        waiting_room: true,       // 待機室あり（安全）
        auto_recording: "none",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Zoom ミーティング作成失敗: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    join_url: string;
    password: string;
    id: number;
  };

  return {
    join_url:   data.join_url,
    password:   data.password,
    meeting_id: String(data.id),
  };
}

// ─── Vercel Function エントリーポイント ───────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS（Vercel同一オリジンなので基本不要だが念のため）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date, time, customerName } = req.body as {
    date?: string;
    time?: string;
    customerName?: string;
  };

  if (!date || !time) {
    return res.status(400).json({ error: "date と time は必須です" });
  }

  try {
    // 日時を JST → UTC ISO 文字列に変換
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes]   = time.split(":").map(Number);
    // Zoom API は "YYYY-MM-DDTHH:mm:ss" + timezone: "Asia/Tokyo" で受け取れる
    const pad = (n: number) => String(n).padStart(2, "0");
    const startTime = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;

    const topic = customerName
      ? `COLORSオンライン相談 - ${customerName} 様`
      : "COLORSオンライン相談";

    const token  = await getZoomAccessToken();
    const result = await createMeeting(token, topic, startTime, 45); // 45分

    return res.status(200).json({
      join_url:   result.join_url,
      password:   result.password,
      meeting_id: result.meeting_id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "不明なエラー";
    return res.status(500).json({ error: message });
  }
}
