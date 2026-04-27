import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Share2,
  Link as LinkIcon,
  Check,
  Quote,
  Square,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  AlignLeft,
  Mail,
} from 'lucide-react';

type LayoutKind = 'headline' | 'quote' | 'cover' | 'excerpt';

interface ShareFormat {
  id: string;
  label: string;
  description: string;
  width: number;
  height: number;
  layout: LayoutKind;
  icon: React.ComponentType<{ className?: string }>;
}

const FORMATS: ShareFormat[] = [
  {
    id: 'square-headline',
    label: 'Square',
    description: 'Instagram · Facebook',
    width: 1080,
    height: 1080,
    layout: 'headline',
    icon: Square,
  },
  {
    id: 'story-quote',
    label: 'Story',
    description: 'IG / FB Stories',
    width: 1080,
    height: 1920,
    layout: 'quote',
    icon: Smartphone,
  },
  {
    id: 'landscape-cover',
    label: 'Landscape',
    description: 'Twitter · LinkedIn',
    width: 1200,
    height: 630,
    layout: 'cover',
    icon: Monitor,
  },
  {
    id: 'square-quote',
    label: 'Pull Quote',
    description: 'Lift a line out',
    width: 1080,
    height: 1080,
    layout: 'quote',
    icon: Quote,
  },
  {
    id: 'portrait-excerpt',
    label: 'Excerpt',
    description: 'Title + body',
    width: 1080,
    height: 1350,
    layout: 'excerpt',
    icon: AlignLeft,
  },
];

type GradientStop = { offset: number; color: string };
type ThemeBackground =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; angle: number; stops: GradientStop[] };

interface ShareTheme {
  id: string;
  label: string;
  background: ThemeBackground;
  text: string;
  muted: string;
  accent: string;
  swatch: string;
}

const THEMES: ShareTheme[] = [
  {
    id: 'black-power',
    label: 'Black Power',
    background: { type: 'solid', color: '#000000' },
    text: '#FFFFFF',
    muted: 'rgba(255,255,255,0.65)',
    accent: '#FFD700',
    swatch: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
  },
  {
    id: 'news-purple',
    label: 'News',
    background: { type: 'solid', color: '#0a0a14' },
    text: '#F5F1E8',
    muted: 'rgba(245,241,232,0.65)',
    accent: '#9B4DCA',
    swatch: 'linear-gradient(135deg, #0a0a14 0%, #9B4DCA 100%)',
  },
  {
    id: 'voices-green',
    label: 'Voices',
    background: { type: 'solid', color: '#0a0a14' },
    text: '#F5F1E8',
    muted: 'rgba(245,241,232,0.65)',
    accent: '#00A86B',
    swatch: 'linear-gradient(135deg, #0a0a14 0%, #00A86B 100%)',
  },
  {
    id: 'sovereignty-gold',
    label: 'Gold',
    background: { type: 'solid', color: '#FFD700' },
    text: '#000000',
    muted: 'rgba(0,0,0,0.7)',
    accent: '#000000',
    swatch: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
  },
  {
    id: 'healing',
    label: 'Healing',
    background: { type: 'solid', color: '#A8C69F' },
    text: '#1A1A1A',
    muted: 'rgba(26,26,26,0.7)',
    accent: '#9B4DCA',
    swatch: 'linear-gradient(135deg, #A8C69F 0%, #7DA579 100%)',
  },
];

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  excerpt?: string;
  quote?: string;
  author?: string;
  publication?: string;
}

const SANS_STACK =
  '"Inter", "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
const SERIF_STACK = 'Georgia, "Times New Roman", serif';

function applyBackground(
  ctx: CanvasRenderingContext2D,
  bg: ThemeBackground,
  width: number,
  height: number,
) {
  if (bg.type === 'solid') {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const angleRad = (bg.angle * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;
  const len = (Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad))) / 2;
  const dx = Math.cos(angleRad) * len;
  const dy = Math.sin(angleRad) * len;
  const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  for (const stop of bg.stops) grad.addColorStop(stop.offset, stop.color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(`${last}…`).width > maxWidth) {
      let trimmed = last;
      while (trimmed.length > 0 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
        trimmed = trimmed.slice(0, -1);
      }
      lines[maxLines - 1] = `${trimmed.trimEnd()}…`;
    } else if (words.join(' ').length > lines.join(' ').length) {
      lines[maxLines - 1] = `${last}…`;
    }
  }
  return lines;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  weight: number,
  maxWidth: number,
  maxLines: number,
  startSize: number,
  minSize: number,
): { size: number; lines: string[] } {
  let size = startSize;
  while (size >= minSize) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    const lines = wrapText(ctx, text, maxWidth, maxLines);
    const ellipsised = lines[lines.length - 1]?.endsWith('…');
    if (!ellipsised || size === minSize) {
      return { size, lines };
    }
    size -= 4;
  }
  ctx.font = `${weight} ${minSize}px ${fontFamily}`;
  return { size: minSize, lines: wrapText(ctx, text, maxWidth, maxLines) };
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number,
  align: CanvasTextAlign = 'left',
) {
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight);
  });
}

function drawAccentBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBrandMark(
  ctx: CanvasRenderingContext2D,
  publication: string,
  textColor: string,
  accentColor: string,
  x: number,
  y: number,
  size: number,
) {
  ctx.font = `800 ${size}px ${SANS_STACK}`;
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const dotSize = size * 0.35;
  ctx.beginPath();
  ctx.arc(x + dotSize / 2, y, dotSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.fillText(publication.toUpperCase(), x + dotSize + size * 0.4, y);
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function renderShareCard(
  canvas: HTMLCanvasElement,
  format: ShareFormat,
  theme: ShareTheme,
  data: { title: string; quote?: string; excerpt?: string; author?: string; publication: string; url: string },
) {
  const { width, height, layout } = format;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  applyBackground(ctx, theme.background, width, height);

  const padding = Math.round(Math.min(width, height) * 0.08);
  const contentWidth = width - padding * 2;

  drawAccentBar(ctx, padding, padding, Math.round(width * 0.12), 6, theme.accent);

  const brandSize = Math.max(20, Math.round(width * 0.022));
  drawBrandMark(
    ctx,
    data.publication,
    theme.text,
    theme.accent,
    padding,
    padding + 40,
    brandSize,
  );

  const domain = getDomain(data.url);
  ctx.font = `600 ${brandSize}px ${SANS_STACK}`;
  ctx.fillStyle = theme.muted;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(domain, width - padding, padding + 40);

  const bodyTop = padding + 100;
  const bodyBottom = height - padding - 80;
  const bodyHeight = bodyBottom - bodyTop;

  if (layout === 'headline') {
    const startSize = Math.round(width * 0.085);
    const minSize = Math.round(width * 0.045);
    const { size, lines } = fitFontSize(
      ctx,
      data.title,
      SANS_STACK,
      800,
      contentWidth,
      6,
      startSize,
      minSize,
    );
    const lineHeight = size * 1.1;
    const totalH = lineHeight * lines.length;
    const startY = bodyTop + (bodyHeight - totalH) / 2;
    ctx.fillStyle = theme.text;
    ctx.font = `800 ${size}px ${SANS_STACK}`;
    drawLines(ctx, lines, padding, startY, lineHeight, 'left');
  } else if (layout === 'quote') {
    const quoteText = data.quote || data.excerpt || data.title;
    const quoteMarkSize = Math.round(width * 0.18);
    ctx.font = `700 ${quoteMarkSize}px ${SERIF_STACK}`;
    ctx.fillStyle = theme.accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('"', padding - 10, bodyTop - 30);

    const startSize = Math.round(width * 0.07);
    const minSize = Math.round(width * 0.04);
    const { size, lines } = fitFontSize(
      ctx,
      quoteText,
      SERIF_STACK,
      500,
      contentWidth,
      8,
      startSize,
      minSize,
    );
    const lineHeight = size * 1.3;
    const totalH = lineHeight * lines.length;
    const startY = bodyTop + quoteMarkSize * 0.6 + (bodyHeight - totalH - quoteMarkSize * 0.6) / 2;
    ctx.fillStyle = theme.text;
    ctx.font = `500 italic ${size}px ${SERIF_STACK}`;
    drawLines(ctx, lines, padding, startY, lineHeight, 'left');

    if (data.author) {
      const attrSize = Math.max(18, Math.round(width * 0.024));
      ctx.font = `600 ${attrSize}px ${SANS_STACK}`;
      ctx.fillStyle = theme.muted;
      ctx.textAlign = 'left';
      ctx.fillText(`— ${data.author}`, padding, startY + totalH + 30);
    }
  } else if (layout === 'cover') {
    const startSize = Math.round(height * 0.13);
    const minSize = Math.round(height * 0.07);
    const { size, lines } = fitFontSize(
      ctx,
      data.title,
      SANS_STACK,
      800,
      contentWidth,
      3,
      startSize,
      minSize,
    );
    const lineHeight = size * 1.1;
    ctx.fillStyle = theme.text;
    ctx.font = `800 ${size}px ${SANS_STACK}`;
    drawLines(ctx, lines, padding, bodyTop + 20, lineHeight, 'left');

    if (data.excerpt) {
      const subSize = Math.max(20, Math.round(height * 0.04));
      ctx.font = `400 ${subSize}px ${SANS_STACK}`;
      const subLines = wrapText(ctx, data.excerpt, contentWidth, 2);
      ctx.fillStyle = theme.muted;
      drawLines(
        ctx,
        subLines,
        padding,
        bodyTop + 20 + lines.length * lineHeight + 24,
        subSize * 1.4,
        'left',
      );
    }
  } else if (layout === 'excerpt') {
    const titleSize = Math.round(width * 0.06);
    const minTitle = Math.round(width * 0.04);
    const { size: tSize, lines: tLines } = fitFontSize(
      ctx,
      data.title,
      SANS_STACK,
      800,
      contentWidth,
      4,
      titleSize,
      minTitle,
    );
    ctx.fillStyle = theme.text;
    ctx.font = `800 ${tSize}px ${SANS_STACK}`;
    const tLineHeight = tSize * 1.1;
    drawLines(ctx, tLines, padding, bodyTop + 20, tLineHeight, 'left');

    const dividerY = bodyTop + 20 + tLines.length * tLineHeight + 36;
    ctx.fillStyle = theme.accent;
    ctx.fillRect(padding, dividerY, Math.round(width * 0.18), 4);

    if (data.excerpt) {
      const exSize = Math.max(24, Math.round(width * 0.034));
      ctx.font = `400 ${exSize}px ${SERIF_STACK}`;
      const remaining = bodyBottom - (dividerY + 40);
      const maxExLines = Math.max(3, Math.floor(remaining / (exSize * 1.5)));
      const exLines = wrapText(ctx, data.excerpt, contentWidth, maxExLines);
      ctx.fillStyle = theme.text;
      drawLines(ctx, exLines, padding, dividerY + 40, exSize * 1.5, 'left');
    }
  }

  ctx.font = `600 ${brandSize}px ${SANS_STACK}`;
  ctx.fillStyle = theme.muted;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('SHARE THE WORK · ', padding, height - padding);
  ctx.fillStyle = theme.accent;
  const lead = ctx.measureText('SHARE THE WORK · ').width;
  ctx.fillText(domain, padding + lead, height - padding);
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  excerpt,
  quote,
  author,
  publication = 'BLKOUT',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [formatId, setFormatId] = useState<string>(FORMATS[0].id);
  const [themeId, setThemeId] = useState<string>(THEMES[0].id);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [copiedAction, setCopiedAction] = useState<'link' | 'image' | null>(null);

  const format = useMemo(() => FORMATS.find((f) => f.id === formatId)!, [formatId]);
  const theme = useMemo(() => THEMES.find((t) => t.id === themeId)!, [themeId]);

  useEffect(() => {
    if (!isOpen) return;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    renderShareCard(canvasRef.current, format, theme, {
      title,
      quote,
      excerpt,
      author,
      publication,
      url,
    });
    setPreviewUrl(canvasRef.current.toDataURL('image/png'));
  }, [isOpen, format, theme, title, quote, excerpt, author, publication, url]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
      a.href = objectUrl;
      a.download = `${safeTitle || 'share'}-${format.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    }, 'image/png');
  }, [format.id, title]);

  const handleCopyImage = useCallback(async () => {
    if (!canvasRef.current) return;
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
      handleDownload();
      return;
    }
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedAction('image');
        setTimeout(() => setCopiedAction(null), 2000);
      } catch {
        handleDownload();
      }
    }, 'image/png');
  }, [handleDownload]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedAction('link');
      setTimeout(() => setCopiedAction(null), 2000);
    } catch {
      /* noop */
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (!canvasRef.current || !navigator.share) {
      handleDownload();
      return;
    }
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `${format.id}.png`, { type: 'image/png' });
      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title, text: excerpt ?? title, url, files: [file] });
        } else {
          await navigator.share({ title, text: excerpt ?? title, url });
        }
      } catch {
        /* user cancelled or unsupported */
      }
    }, 'image/png');
  }, [excerpt, format.id, handleDownload, title, url]);

  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt ?? '');
  const encodedUrl = encodeURIComponent(url);
  const platformShare = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal-backdrop animate-in fade-in duration-200" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 md:inset-auto md:top-[50%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2 z-modal w-full h-full md:w-[92vw] md:h-[88vh] md:max-w-[1100px] md:max-h-[760px] bg-liberation-black-soft md:rounded-2xl shadow-liberation-xl overflow-hidden border border-liberation-neutral-800 focus:outline-none"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-liberation-neutral-800 bg-liberation-black">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-liberation-pride-purple to-liberation-pride-pink flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="text-white font-bold text-base md:text-lg truncate">
                  Share this piece
                </Dialog.Title>
                <p className="text-liberation-neutral-400 text-xs md:text-sm truncate">
                  Pick a format and theme that fits where you're sharing
                </p>
              </div>
            </div>
            <Dialog.Close
              aria-label="Close share dialog"
              className="text-liberation-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-liberation-neutral-800 shrink-0"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="grid md:grid-cols-[1fr_320px] h-[calc(100%-65px)]">
            <div className="flex items-center justify-center bg-liberation-black p-4 md:p-8 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${format.id}-${theme.id}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative shadow-liberation-xl rounded-lg overflow-hidden max-h-full"
                  style={{
                    aspectRatio: `${format.width} / ${format.height}`,
                    width: 'auto',
                    height: 'min(60vh, 100%)',
                    maxWidth: '100%',
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={`${format.label} preview`}
                      className="w-full h-full object-contain block"
                    />
                  ) : (
                    <div className="w-full h-full bg-liberation-neutral-900 animate-pulse" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-liberation-neutral-800 bg-liberation-black-soft overflow-y-auto">
              <div className="p-5 space-y-6">
                <section>
                  <h3 className="text-xs font-bold tracking-widest text-liberation-neutral-400 mb-3 uppercase">
                    Format
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {FORMATS.map((f) => {
                      const Icon = f.icon;
                      const active = f.id === formatId;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormatId(f.id)}
                          aria-pressed={active}
                          className={`group flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-all ${
                            active
                              ? 'border-liberation-gold-divine bg-liberation-gold-divine/10'
                              : 'border-liberation-neutral-800 hover:border-liberation-neutral-600 bg-liberation-black'
                          }`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Icon
                              className={`w-4 h-4 ${
                                active ? 'text-liberation-gold-divine' : 'text-liberation-neutral-400'
                              }`}
                            />
                            <span
                              className={`text-sm font-semibold ${
                                active ? 'text-white' : 'text-liberation-neutral-200'
                              }`}
                            >
                              {f.label}
                            </span>
                          </div>
                          <span className="text-[11px] text-liberation-neutral-500 leading-tight">
                            {f.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold tracking-widest text-liberation-neutral-400 mb-3 uppercase">
                    Theme
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {THEMES.map((t) => {
                      const active = t.id === themeId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setThemeId(t.id)}
                          aria-pressed={active}
                          aria-label={`Theme: ${t.label}`}
                          title={t.label}
                          className={`relative aspect-square rounded-lg border-2 transition-all ${
                            active
                              ? 'border-liberation-gold-divine scale-105'
                              : 'border-liberation-neutral-800 hover:border-liberation-neutral-500'
                          }`}
                          style={{ background: t.swatch }}
                        >
                          {active && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-4 h-4 text-liberation-gold-divine drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-liberation-neutral-500 mt-2">{theme.label}</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-xs font-bold tracking-widest text-liberation-neutral-400 mb-1 uppercase">
                    Save & share
                  </h3>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-liberation-gold-divine text-black font-semibold hover:bg-liberation-gold-rich transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download image
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyImage}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg bg-liberation-black border border-liberation-neutral-800 text-white text-sm font-medium hover:border-liberation-pride-purple hover:bg-liberation-pride-purple/10 transition-all"
                    >
                      {copiedAction === 'image' ? (
                        <>
                          <Check className="w-4 h-4 text-liberation-success" /> Copied
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4" /> Copy image
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg bg-liberation-black border border-liberation-neutral-800 text-white text-sm font-medium hover:border-liberation-pride-pink hover:bg-liberation-pride-pink/10 transition-all"
                    >
                      <Share2 className="w-4 h-4" /> Share…
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-liberation-black border border-liberation-neutral-800 text-white text-sm font-medium hover:border-liberation-gold-divine hover:bg-liberation-gold-divine/10 transition-all"
                  >
                    {copiedAction === 'link' ? (
                      <>
                        <Check className="w-4 h-4 text-liberation-success" /> Link copied
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" /> Copy link
                      </>
                    )}
                  </button>
                </section>

                <section>
                  <h3 className="text-xs font-bold tracking-widest text-liberation-neutral-400 mb-3 uppercase">
                    Quick share
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    <a
                      href={platformShare.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Twitter"
                      className="group flex items-center justify-center h-10 rounded-lg bg-liberation-black border border-liberation-neutral-800 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-liberation-neutral-300 group-hover:text-[#1DA1F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={platformShare.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on WhatsApp"
                      className="group flex items-center justify-center h-10 rounded-lg bg-liberation-black border border-liberation-neutral-800 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-liberation-neutral-300 group-hover:text-[#25D366]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    <a
                      href={platformShare.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                      className="group flex items-center justify-center h-10 rounded-lg bg-liberation-black border border-liberation-neutral-800 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all"
                    >
                      <svg
                        className="w-4 h-4 text-liberation-neutral-300 group-hover:text-[#0A66C2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href={platformShare.email}
                      aria-label="Share via email"
                      className="group flex items-center justify-center h-10 rounded-lg bg-liberation-black border border-liberation-neutral-800 hover:border-liberation-gold-divine hover:bg-liberation-gold-divine/10 transition-all"
                    >
                      <Mail className="w-4 h-4 text-liberation-neutral-300 group-hover:text-liberation-gold-divine" />
                    </a>
                  </div>
                  <p className="text-[11px] text-liberation-neutral-500 mt-3">
                    Tip: download the image first, then attach it when sharing — most platforms strip
                    inline images from share links.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareModal;
