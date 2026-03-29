"use server";

export const classifyText = async (text: string) => {
  const token = process.env.NEXT_PUBLIC_HF_API_TOKEN;

  if (!token || token === "your_huggingface_api_token_here") {
    throw new Error("Hugging Face API Token is not configured.");
  }

  const modelId = "facebook/bart-large-mnli";
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
          // 英語のラベルの方がモデルの理解度が高いため、英語で判定してからマッピングします
          candidate_labels: ["question", "insight", "worry", "interesting"],
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

    type HFResponse = {
      labels: string[];
      scores: number[];
    };

    const data: HFResponse = await response.json();
    return formatResult(data);
  } catch (error: any) {
    console.error("Hugging Face Network/Fetch Error:", error.message);
    throw error;
  }
};

// レスポンスの形式を統一し、英語ラベルを日本語に変換するヘルパー
function formatResult(data: any) {
  let topLabel = "未分類";
  let rawLabel = "";

  if (Array.isArray(data)) {
    rawLabel = data[0]?.label || "";
  } else if (data && data.labels && data.labels[0]) {
    rawLabel = data.labels[0];
  }

  // マッピング処理
  const mapping: { [key: string]: string } = {
    question: "質問",
    insight: "気づき",
    worry: "モヤモヤ",
    interesting: "面白い",
  };

  topLabel = mapping[rawLabel] || "未分類";

  console.log(`Extracted Label (Raw: ${rawLabel}) -> ${topLabel}`);
  return { label: topLabel };
}
