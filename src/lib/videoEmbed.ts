export type EmbedKind = "youtube" | "vimeo" | "file" | "internal" | "external";

export function getVideoKind(url: string): EmbedKind {
  if (!url.startsWith("http")) return "internal";
  if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\//.test(url)) {
    return "youtube";
  }
  if (/^https?:\/\/(www\.)?vimeo\.com\//.test(url)) {
    return "vimeo";
  }
  if (/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(url)) {
    return "file";
  }
  return "external";
}

function youtubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube(-nocookie)?\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube(-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube(-nocookie)?\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[m.length - 1];
  }
  return null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

/** 유튜브/비메오 링크를 임베드용 iframe src로 변환합니다. 지원하지 않는 형식이면 null. */
export function getEmbedSrc(url: string): string | null {
  const kind = getVideoKind(url);
  if (kind === "youtube") {
    const id = youtubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (kind === "vimeo") {
    const id = vimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}
