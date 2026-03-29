"use server";

/**
 * Hugging Face APIからのレスポンスの型定義
 */
type HFResponseObject = {
  labels: string[];
  scores: number[];
};

type HFResponseArrayItem = {
  label: string;
  score: number;
};

// APIは複数の形式でレスポンスを返す可能性があるため、Union型で両方を許容します
type HFData = HFResponseObject | HFResponseArrayItem[];

export const classifyText = async (text: string) => {
  const token = process.env.NEXT_PUBLIC_HF_API_TOKEN;

  if (!token || token === "your_huggingface_api_token_here") {
    throw new Error("Hugging Face API Token is not configured.");
  }

  // 日本語対応の多言語ゼロショット分類モデルに変更
  const modelId = "MoritzLaurer/mDeBERTa-v3-base-mnli-xnli";
  const url = `https://router.huggingface.co/hf-inference/models/${modelId}`;

  try {
    console.log(`Fetching AI classification from: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true", // モデル読み込みを待機
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          // 日本語対応モデルなので、直接日本語のラベルを候補として渡します
          candidate_labels: ["質問", "気づき", "モヤモヤ", "面白い"],
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", response.status, errorText);
      throw new Error(
        `Hugging Face API Error: ${response.status} - ${errorText}`,
      );
    }

    const data: HFData = await response.json();
    return formatResult(data);
  } catch (error: unknown) {
    console.error(
      "Hugging Face Network/Fetch Error:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
};

// レスポンスの形式を統一し、英語ラベルを日本語に変換するヘルパー
function formatResult(data: HFData) {
  let topLabel = "未分類";

  if (Array.isArray(data)) {
    topLabel = data[0]?.label || "未分類";
  } else if (data && data.labels && data.labels[0]) {
    topLabel = data.labels[0];
  }

  console.log(`Extracted Label -> ${topLabel}`);
  return { label: topLabel };
}
