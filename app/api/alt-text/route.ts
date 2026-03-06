import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { fetchPage } from '@/lib/scanner/fetch-page';

export const runtime = 'nodejs';
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ImageResult {
  src: string;
  currentAlt: string | null;
  suggestedAlt: string | null;
  status: 'missing' | 'generic' | 'ok';
  error?: string;
}

const GENERIC_ALTS = new Set([
  '', 'image', 'img', 'photo', 'picture', 'logo', 'icon',
  'banner', 'thumbnail', 'untitled', 'null', 'undefined',
]);

function isGenericAlt(alt: string | null): boolean {
  if (alt === null) return true;
  const lower = alt.toLowerCase().trim();
  return GENERIC_ALTS.has(lower) || lower.length < 3;
}

async function generateAltText(imageUrl: string): Promise<string> {
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    throw new Error('Not a public HTTP image');
  }

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: imageUrl },
          },
          {
            type: 'text',
            text: 'Write a concise, descriptive alt text for this image (max 125 characters). Describe what is shown and its likely purpose on the page. Reply with only the alt text — no quotes, no explanation.',
          },
        ],
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('No text response');
  return block.text.trim();
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const { url } = (await request.json()) as { url?: string };
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const { $, finalUrl } = await fetchPage(parsedUrl.toString());
    const origin = new URL(finalUrl).origin;

    const rawImages: { src: string; alt: string | null }[] = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src') ?? '';
      if (!src || src.startsWith('data:')) return;

      // Resolve to absolute URL
      let absoluteSrc: string;
      try {
        absoluteSrc = new URL(src, origin).toString();
      } catch {
        return;
      }

      rawImages.push({
        src: absoluteSrc,
        alt: $(el).attr('alt') ?? null,
      });
    });

    // Cap at 30 images
    const capped = rawImages.slice(0, 30);
    const needsAlt = capped.filter((img) => isGenericAlt(img.alt));
    const hasAlt = capped.filter((img) => !isGenericAlt(img.alt));

    // Generate alt text in parallel (cap at 10 AI calls to stay within timeout)
    const toGenerate = needsAlt.slice(0, 10);
    const generated = await Promise.allSettled(
      toGenerate.map(async (img) => {
        const suggestedAlt = await generateAltText(img.src);
        return { ...img, suggestedAlt };
      })
    );

    const results: ImageResult[] = [
      // Images that needed alt text
      ...toGenerate.map((img, i) => {
        const result = generated[i];
        return {
          src: img.src,
          currentAlt: img.alt,
          status: img.alt === null ? ('missing' as const) : ('generic' as const),
          suggestedAlt: result.status === 'fulfilled' ? result.value.suggestedAlt : null,
          error: result.status === 'rejected' ? String(result.reason) : undefined,
        };
      }),
      // Images that already have alt text
      ...hasAlt.map((img) => ({
        src: img.src,
        currentAlt: img.alt,
        status: 'ok' as const,
        suggestedAlt: null,
      })),
      // Remaining images not AI-processed
      ...needsAlt.slice(10).map((img) => ({
        src: img.src,
        currentAlt: img.alt,
        status: img.alt === null ? ('missing' as const) : ('generic' as const),
        suggestedAlt: null,
      })),
    ];

    return NextResponse.json({
      url: parsedUrl.toString(),
      total: capped.length,
      missing: needsAlt.length,
      generated: toGenerate.length,
      results,
    });
  } catch (err) {
    console.error('Alt text error:', err);
    return NextResponse.json(
      { error: 'Scan failed. Please try again.' },
      { status: 500 }
    );
  }
}
