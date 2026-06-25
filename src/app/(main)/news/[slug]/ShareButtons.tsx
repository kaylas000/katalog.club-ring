"use client";

import { useState } from "react";

interface Props {
  slug: string;
  title: string;
}

export default function ShareButtons({ slug, title }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `https://club-ring.ru/news/${slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary font-semibold">Поделиться:</span>
      <a
        href={`https://vk.com/share.php?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-bg-elevated text-text-muted px-3 py-1.5 rounded-full border border-border hover:border-bronze hover:text-bronze transition-colors"
      >
        VK
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-bg-elevated text-text-muted px-3 py-1.5 rounded-full border border-border hover:border-bronze hover:text-bronze transition-colors"
      >
        Telegram
      </a>
      <button
        onClick={handleCopy}
        className="text-xs bg-bg-elevated text-text-muted px-3 py-1.5 rounded-full border border-border hover:border-bronze hover:text-bronze transition-colors"
      >
        {copied ? "Скопировано" : "Копировать"}
      </button>
    </div>
  );
}
