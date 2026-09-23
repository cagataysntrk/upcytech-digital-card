"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

type Props = {
  title: string;
  url: string;
};

export function ShareButton({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Native share dialogs can be dismissed intentionally.
    }
  }

  return (
    <button className="button button-secondary" onClick={share} type="button">
      <Icon name="share" className="button-svg" />
      {copied ? "Bağlantı kopyalandı" : "Kartı paylaş"}
    </button>
  );
}
