/**
 * OpenAI API クライアント
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

/**
 * ファイルをBase64に変換
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 写真から劣化状況を分析（OpenAI Vision API）
 */
export const analyzePhotoDeterioration = async (
  photos: File[]
): Promise<{
  deteriorationLevel: '軽度' | '中度' | '重度';
  analysis: string;
  confidence: number;
}> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  if (photos.length === 0) {
    throw new Error('No photos provided');
  }

  try {
    // 写真をBase64に変換（最大4枚まで）
    const photosToAnalyze = photos.slice(0, 4);
    const imageContents = await Promise.all(
      photosToAnalyze.map(async (photo) => {
        const base64 = await fileToBase64(photo);
        return {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${base64}`,
          },
        };
      })
    );

    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `あなたは建築物の外壁・屋根の劣化状況を専門に分析するエキスパートです。
写真を見て、以下の基準で劣化状況を判定してください：

【軽度】
- 軽微な汚れ、色褪せ
- 小さなひび割れ（1mm以下）
- 部分的に塗装が剥がれている箇所が少ない
- 補修箇所が少ない

【中度】
- 中程度の汚れ、色褪せ
- 中程度のひび割れ（1-3mm）
- 塗装が剥がれている箇所が複数ある
- 一部補修が必要

【重度】
- 深刻な汚れ、色褪せ
- 大きなひび割れ（3mm以上）
- 広範囲に塗装が剥がれている
- 大規模な補修が必要

JSON形式で回答してください：
{
  "deteriorationLevel": "軽度" | "中度" | "重度",
  "analysis": "詳細な分析内容（日本語）",
  "confidence": 0.0-1.0の信頼度
}`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'これらの写真を分析して、建物の劣化状況を判定してください。',
              },
              ...imageContents,
            ],
          },
        ],
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze photos');
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      deteriorationLevel: content.deteriorationLevel || '中度',
      analysis: content.analysis || '分析を完了しました。',
      confidence: content.confidence || 0.7,
    };
  } catch (error: any) {
    console.error('Photo analysis error:', error);
    throw new Error(error.message || '写真の分析に失敗しました');
  }
};

/**
 * AI見積もり計算（GPT-4）
 */
export const calculateAIEstimate = async (
  buildingType: string,
  buildingAge: number,
  floorArea: number,
  floors: number,
  workTypes: string[],
  deteriorationLevel: string,
  photoAnalysis?: {
    deteriorationLevel: string;
    analysis: string;
    confidence: number;
  }
): Promise<{
  min: number;
  max: number;
  breakdown: {
    item: string;
    amount: number;
    description: string;
  }[];
  aiNotes: string;
}> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const prompt = `あなたは建築リフォーム・塗装工事の見積もりを専門とするエキスパートです。
以下の情報を基に、詳細な見積もりを算出してください。

【建物情報】
- 建物種別: ${buildingType}
- 築年数: ${buildingAge}年
- 延床面積: ${floorArea}㎡
- 階数: ${floors}階

【施工内容】
${workTypes.map((type) => `- ${type}`).join('\n')}

【劣化状況】
- ユーザー入力: ${deteriorationLevel}
${photoAnalysis ? `- AI分析結果: ${photoAnalysis.deteriorationLevel} (信頼度: ${(photoAnalysis.confidence * 100).toFixed(0)}%)\n- 分析詳細: ${photoAnalysis.analysis}` : ''}

【見積もり算出基準】
- 外壁塗装: 基本単価 3,000円/㎡（劣化状況により補正）
- 屋根塗装: 150,000円〜（面積・劣化状況により変動）
- 防水工事: 200,000円〜（面積・劣化状況により変動）
- 内装リフォーム: 300,000円〜（面積により変動）

劣化状況の補正率：
- 軽度: 1.0倍
- 中度: 1.2倍
- 重度: 1.4倍

築年数による補正：
- 10年未満: 1.0倍
- 10-20年: 1.1倍
- 20-30年: 1.2倍
- 30年以上: 1.3倍

以下のJSON形式で回答してください：
{
  "min": 最小見積もり金額（税抜）,
  "max": 最大見積もり金額（税抜）,
  "breakdown": [
    {
      "item": "項目名",
      "amount": 金額（税抜）,
      "description": "説明"
    }
  ],
  "aiNotes": "AIからの補足説明や注意事項（日本語）"
}

金額は税抜きで計算し、後で10%の消費税を加算します。`;

    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'あなたは建築リフォーム・塗装工事の見積もりを専門とするエキスパートです。正確で詳細な見積もりを提供してください。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        temperature: 0.3, // より一貫性のある結果のため
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to calculate estimate');
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    // 税込に変換
    return {
      min: Math.round(content.min * 1.1),
      max: Math.round(content.max * 1.1),
      breakdown: content.breakdown || [],
      aiNotes: content.aiNotes || '',
    };
  } catch (error: any) {
    console.error('AI estimate calculation error:', error);
    throw new Error(error.message || 'AI見積もりの計算に失敗しました');
  }
};
