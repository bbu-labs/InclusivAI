const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

/**
 * Fetch SVG from backend, convert to PNG via canvas, and share/download.
 */
export async function fetchAndShareImage(
  analysisId: string,
  hash: string
): Promise<void> {
  // 1. Fetch SVG from backend
  const res = await fetch(
    `${API_URL}/api/share/${analysisId}/image?hash=${hash}`
  );
  if (!res.ok) throw new Error("Failed to generate image");
  const svgText = await res.text();

  // 2. Convert SVG → PNG via canvas
  const pngBlob = await svgToPng(svgText, 1200, 630);

  // 3. Share or download
  const file = new File([pngBlob], "analise-clausula-oculta.png", {
    type: "image/png",
  });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "Análise - Cláusula Oculta",
      files: [file],
    });
  } else {
    const url = URL.createObjectURL(pngBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analise-clausula-oculta.png";
    a.click();
    URL.revokeObjectURL(url);
  }
}

function svgToPng(svgText: string, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create PNG blob"));
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load SVG"));
    // Encode SVG as data URL to avoid CORS issues with canvas
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
  });
}
