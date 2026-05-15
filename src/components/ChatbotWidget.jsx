import { useEffect, useRef, useState } from "react";
import { X, Send, ExternalLink, Download } from "lucide-react";
import chatbotBot from "../assets/chatbot-bot.png";

const RESUME_URL = "/Ravi-Kumar-CV.pdf";

const LinkPill = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="chatbot-link-pill group inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[10px] font-medium bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/60 transition-colors max-w-full leading-tight"
  >
    <span className="truncate">{label}</span>
    {icon === "download" ? (
      <Download
        className="w-2 h-2 shrink-0 chatbot-icon-bounce group-hover:text-primary"
        aria-hidden="true"
      />
    ) : (
      <ExternalLink
        className="w-2 h-2 shrink-0 chatbot-icon-float group-hover:text-primary"
        aria-hidden="true"
      />
    )}
  </a>
);

const InlineLink = ({ href, children, icon = "external" }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="chatbot-inline-link inline-flex items-baseline gap-0.5 text-primary hover:text-primary/80 underline decoration-primary/40 hover:decoration-primary underline-offset-2 transition-colors break-words"
  >
    <span>{children}</span>
    {icon === "download" ? (
      <Download className="w-2.5 h-2.5 shrink-0 translate-y-[1px] opacity-70" aria-hidden="true" />
    ) : (
      <ExternalLink
        className="w-2.5 h-2.5 shrink-0 translate-y-[1px] opacity-70"
        aria-hidden="true"
      />
    )}
  </a>
);

const URL_REGEX = /(https?:\/\/[^\s)]+|\/[A-Za-z0-9_\-./]+\.(?:pdf|jpg|jpeg|png|docx?))/gi;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;

// Cue suffixes that precede a URL ("verify:", ", verify here:", "link:", etc.)
// We strip them so the preceding label becomes the link text.
const CUE_SUFFIX_REGEX =
  /[\s]*[,\-–—:]?\s*(?:verify(?:\s+(?:certification|here|it|now|link))?|click(?:\s+here)?|link|url|view(?:\s+here)?|see(?:\s+here)?|open(?:\s+here)?|available(?:\s+(?:here|at))?|here|at|on)\s*[:\-–—]?\s*$/i;

// Trim leading bullet/whitespace and capture it for re-emit
const LEADING_BULLET_REGEX = /^(\s*(?:[•·\-*]\s+)?)/;

const iconForUrl = (url) => {
  const u = url.toLowerCase();
  if (/(resume|cv)[^/]*\.(pdf|docx?)/i.test(url) || u.endsWith("/ravi-kumar-cv.pdf")) {
    return "download";
  }
  return "external";
};

const fallbackLabel = (url) => {
  const u = url.toLowerCase();
  if (u.includes("credly.com")) return "Verify Certification";
  if (u.includes("github.com")) return "View GitHub";
  if (u.includes("linkedin.com")) return "View LinkedIn";
  if (/(resume|cv)[^/]*\.(pdf|docx?)/i.test(url) || u.endsWith("/ravi-kumar-cv.pdf"))
    return "Download Resume";
  try {
    return new URL(url, "https://x").hostname.replace(/^www\./, "") || "Open Link";
  } catch {
    return "Open Link";
  }
};

const isCredlyUrl = (url) => /(^|\/\/|\.)credly\.com\//i.test(url);

// Render a single line with smart link merging:
// - Markdown [label](url) → inline link (credly URLs always become a pill)
// - "Label, verify: <url>" / "Label: <url>" → label becomes the link
// - Bare URL with no label → pill button
const renderLine = (line, keyPrefix) => {
  if (!line) return null;

  // Substitute markdown links first with placeholders we can re-inject.
  // Credly verification URLs are always normalized to a bare URL so they
  // render as a consistent "Verify Certification" pill button.
  const tokens = [];
  let working = line.replace(MARKDOWN_LINK_REGEX, (_, label, url) => {
    if (isCredlyUrl(url)) return ` ${url}`;
    const i = tokens.length;
    tokens.push({ type: "md", label, url });
    return `\u0000MD${i}\u0000`;
  });

  URL_REGEX.lastIndex = 0;
  const segments = [];
  let lastIndex = 0;
  let match;
  let usedLabel = false;
  while ((match = URL_REGEX.exec(working)) !== null) {
    const url = match[0].replace(/[.,;:)]+$/, "");
    let prefix = working.slice(lastIndex, match.index);

    // Try to consume a label from the prefix using a cue suffix
    const stripped = prefix.replace(CUE_SUFFIX_REGEX, "");
    const cueRemoved = stripped !== prefix;

    // Bullet handling — keep bullet outside of the link
    const bulletMatch = stripped.match(LEADING_BULLET_REGEX);
    const bullet = bulletMatch ? bulletMatch[1] : "";
    const labelText = stripped.slice(bullet.length).trim();

    if (isCredlyUrl(url)) {
      // Always render credly URLs as a standalone pill (consistent across all certs)
      if (prefix) segments.push({ type: "text", value: prefix });
      segments.push({ type: "pill", url, label: "Verify Certification", icon: "external" });
    } else if (cueRemoved && labelText) {
      segments.push({ type: "text", value: bullet });
      segments.push({ type: "link", url, label: labelText, icon: iconForUrl(url) });
      usedLabel = true;
    } else if (
      !cueRemoved &&
      labelText &&
      // Only consume the label as a link when the line is essentially "Label <url>"
      // (i.e., no other prose follows or the prefix is short and ends with separators)
      /[:\-–—]\s*$/.test(prefix)
    ) {
      const cleanLabel = labelText.replace(/[:\-–—\s]+$/, "");
      segments.push({ type: "text", value: bullet });
      segments.push({ type: "link", url, label: cleanLabel, icon: iconForUrl(url) });
      usedLabel = true;
    } else {
      // Keep prefix as text, render URL as a pill
      if (prefix) segments.push({ type: "text", value: prefix });
      segments.push({ type: "pill", url, label: fallbackLabel(url), icon: iconForUrl(url) });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < working.length) {
    segments.push({ type: "text", value: working.slice(lastIndex) });
  }

  // If we found no URL at all, return the line as text (with markdown placeholders re-injected)
  if (segments.length === 0) {
    segments.push({ type: "text", value: working });
  }

  // Re-inject markdown link tokens inside text segments
  const renderText = (value, k) => {
    if (!value.includes("\u0000MD")) return <span key={k}>{value}</span>;
    const parts = value.split(/\u0000MD(\d+)\u0000/);
    return (
      <span key={k}>
        {parts.map((p, idx) => {
          if (idx % 2 === 1) {
            const t = tokens[Number(p)];
            return (
              <InlineLink key={`md-${k}-${idx}`} href={t.url} icon={iconForUrl(t.url)}>
                {t.label}
              </InlineLink>
            );
          }
          return <span key={`tx-${k}-${idx}`}>{p}</span>;
        })}
      </span>
    );
  };

  return (
    <span key={keyPrefix}>
      {segments.map((s, i) => {
        const k = `${keyPrefix}-${i}`;
        if (s.type === "text") return renderText(s.value, k);
        if (s.type === "link")
          return (
            <InlineLink key={k} href={s.url} icon={s.icon}>
              {s.label}
            </InlineLink>
          );
        return <LinkPill key={k} href={s.url} label={s.label} icon={s.icon} />;
      })}
    </span>
  );
  // (usedLabel kept for potential future logic)
  void usedLabel;
};

const renderWithLinks = (text, opts = {}) => {
  const { suppressResume = false } = opts;
  const hasUrl = URL_REGEX.test(text) || MARKDOWN_LINK_REGEX.test(text);
  URL_REGEX.lastIndex = 0;
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  const wantsResume = !suppressResume && /\b(resume|cv)\b/i.test(text) && !hasUrl;

  const rawLines = text.split("\n");
  // Pre-process: if a line is just a bare URL and the previous non-empty line
  // looks like a label (no URL, ends without sentence punctuation, short-ish),
  // merge them into "Label: <url>" so renderLine turns the label into the link.
  const BARE_URL_LINE =
    /^\s*(?:[•·\-*]\s+)?(https?:\/\/\S+|\/\S+\.(?:pdf|jpg|jpeg|png|docx?))\s*$/i;
  const lines = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const m = line.match(BARE_URL_LINE);
    if (m && !isCredlyUrl(m[1]) && lines.length > 0) {
      // find previous non-empty line
      let p = lines.length - 1;
      while (p >= 0 && lines[p].trim() === "") p--;
      if (p >= 0) {
        const prev = lines[p];
        const hasUrlInPrev = /(https?:\/\/|\/\S+\.(?:pdf|jpg|jpeg|png|docx?))/i.test(prev);
        const looksLikeLabel =
          !hasUrlInPrev &&
          prev.trim().length > 0 &&
          prev.trim().length <= 60 &&
          !/[.!?]$/.test(prev.trim());
        if (looksLikeLabel) {
          const bulletMatch = m[0].match(LEADING_BULLET_REGEX);
          const bullet = bulletMatch ? bulletMatch[1].replace(/^\s+/, "") : "";
          lines[p] = `${prev.replace(/[\s:：\-–—]+$/, "")}: ${bullet}${m[1]}`;
          continue;
        }
      }
    }
    lines.push(line);
  }
  const HEADINGS = new Set([
    "about",
    "about me",
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "publications",
    "contact",
    "achievements",
    "summary",
    "overview",
    "resume",
  ]);
  const isHeading = (line) => {
    const t = line
      .trim()
      .replace(/[:：]\s*$/, "")
      .toLowerCase();
    return HEADINGS.has(t);
  };
  const isBullet = (line) => /^\s*[•·\-*]\s+/.test(line);

  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      blocks.push({ type: "gap" });
      continue;
    }
    if (isHeading(line)) {
      blocks.push({ type: "heading", line: trimmed.replace(/[:：]\s*$/, "") });
    } else if (isBullet(line)) {
      blocks.push({ type: "bullet", line });
    } else {
      blocks.push({ type: "para", line });
    }
  }

  // Collapse: drop a gap immediately after a heading, and merge consecutive gaps
  const cleaned = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const prev = cleaned[cleaned.length - 1];
    if (b.type === "gap") {
      if (!prev || prev.type === "gap" || prev.type === "heading") continue;
    }
    cleaned.push(b);
  }

  const rendered = cleaned.map((b, i) => {
    const key = `b-${i}`;
    if (b.type === "gap") return <div key={key} className="h-1.5" aria-hidden="true" />;
    if (b.type === "heading") {
      return (
        <div
          key={key}
          className="font-semibold text-foreground mt-2 first:mt-0 mb-0.5 text-[12.5px] sm:text-[13px]"
        >
          {b.line}
        </div>
      );
    }
    if (b.type === "bullet") {
      return (
        <div key={key} className="leading-snug break-words">
          {renderLine(b.line, `l${i}`)}
        </div>
      );
    }
    return (
      <div key={key} className="leading-snug break-words">
        {renderLine(b.line, `l${i}`)}
      </div>
    );
  });

  if (!hasUrl && wantsResume) {
    return (
      <>
        <div className="space-y-0.5">{rendered}</div>
        <div className="mt-2">
          <LinkPill href={RESUME_URL} label="Download Resume" icon="download" />
        </div>
      </>
    );
  }

  return <div className="space-y-0.5 break-words">{rendered}</div>;
};

const WEBHOOK_URL =
  "https://n8n-w19c.srv1635273.hstgr.cloud/webhook/8f41d40d-d514-4c13-8f8c-141ee7302ea5/chat";

const SUGGESTION_OVERLAY_SELECTOR =
  "[class*='quillbot' i],[id*='quillbot' i],[class*='grammarly' i],[data-grammarly],[id*='grammarly' i],[class*='lt-' i],[class*='languagetool' i]";

const INITIAL_MESSAGE = `Hi there! 👋
I'm Ravi's portfolio assistant.

You can ask me about Ravi's experience, projects, skills, education, certifications, or resume.

Looking to connect?`;

const getSessionId = () => {
  if (typeof window === "undefined") return "session";
  let id = window.sessionStorage.getItem("chatbot_session_id");
  if (!id) {
    id = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
    window.sessionStorage.setItem("chatbot_session_id", id);
  }
  return id;
};

export const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: INITIAL_MESSAGE }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const LOADING_MESSAGES = [
    "Reviewing Ravi's portfolio…",
    "Gathering relevant information…",
    "Checking project details…",
    "Preparing a response…",
    "Organizing the response…",
  ];

  useEffect(() => {
    if (!loading) {
      setLoadingMsgIdx(0);
      return;
    }
    const id = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(id);
  }, [loading]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);
  const closeTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const requestClose = (delay = 200) => {
    cancelClose();
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
      closeTimerRef.current = null;
    }, delay);
  };

  // Cleanup any pending close timers on unmount/close
  useEffect(() => {
    if (!open) return;
    return () => {
      cancelClose();
    };
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    const onKey = (e) => {
      if (e.key === "Escape" && open) requestClose(150);
    };
    const onPointerDown = (e) => {
      if (!open) return;
      const target = e.target;
      // Ignore non-element targets (e.g. text nodes from suggestion overlays)
      if (!(target instanceof Node)) return;
      // Ignore if click is inside the panel or launcher
      if (panelRef.current?.contains(target)) return;
      if (launcherRef.current?.contains(target)) return;
      // Ignore if focus is currently on our input (grammar tools / suggestion popups)
      const active = document.activeElement;
      if (active && (active === inputRef.current || panelRef.current?.contains(active))) {
        return;
      }
      // Ignore clicks on common suggestion/grammar overlays that render outside the panel
      if (target instanceof Element) {
        if (target.closest(SUGGESTION_OVERLAY_SELECTOR)) return;
      }
      requestClose(120);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: getSessionId(),
          chatInput: text,
        }),
      });
      let reply = "";
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        reply =
          data.output ||
          data.text ||
          data.message ||
          data.response ||
          (typeof data === "string" ? data : "");
        if (!reply && Array.isArray(data) && data[0]) {
          reply = data[0].output || data[0].text || "";
        }
      } else {
        reply = await res.text();
      }
      if (!reply) reply = "Sorry, I didn't get a response. Please try again.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => {
          if (open) {
            requestClose(120);
          } else {
            cancelClose();
            setClosing(false);
            setOpen(true);
          }
        }}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className="chatbot-launcher-bare fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-12 h-12 flex items-center justify-center text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
      >
        {open ? (
          <X className="w-7 h-7 relative z-10" />
        ) : (
          <img
            src={chatbotBot}
            alt=""
            aria-hidden="true"
            className="logo-mark w-8 h-8 relative z-10 object-contain"
            draggable="false"
          />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Ravi's assistant"
          data-closing={closing ? "true" : "false"}
          className={`chatbot-panel fixed z-50 flex flex-col overflow-hidden
            bottom-24 right-4 left-4 max-h-[70vh]
            sm:left-auto sm:right-6 sm:bottom-24 sm:w-[380px] sm:max-h-[560px]
          ${closing ? "chatbot-panel-closing" : "chatbot-panel-opening"}`}
          onMouseEnter={cancelClose}
          onMouseLeave={(event) => {
            const nextTarget = event.relatedTarget;
            if (nextTarget instanceof Node && panelRef.current?.contains(nextTarget)) {
              return;
            }
            if (nextTarget instanceof Node && launcherRef.current?.contains(nextTarget)) {
              return;
            }
            if (nextTarget instanceof Element && nextTarget.closest(SUGGESTION_OVERLAY_SELECTOR)) {
              return;
            }
            cancelClose();
            leaveTimerRef.current = setTimeout(() => requestClose(150), 600);
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/15">
                <img
                  src={chatbotBot}
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 object-contain"
                  draggable="false"
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-foreground">Portfolio Guide</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => requestClose(150)}
              aria-label="Close chat"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="chatbot-scroll flex-1 overflow-y-auto px-3 py-3 space-y-2 text-[12px] sm:text-[12.5px] leading-relaxed"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm px-3 py-1.5 bg-primary/85 text-primary-foreground whitespace-pre-wrap break-words"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-1.5 bg-secondary/70 text-foreground/95 border border-border/40 whitespace-pre-wrap break-words"
                  }
                >
                  {m.role === "assistant" && m.content === INITIAL_MESSAGE ? (
                    <>
                      {renderWithLinks(m.content, { suppressResume: true })}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <a
                          href={RESUME_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[10px] font-medium bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/60 transition-colors leading-tight"
                        >
                          Download Resume
                          <Download className="w-2.5 h-2.5" aria-hidden="true" />
                        </a>
                        <a
                          href="https://form.ravikumarp.com/form/4125de9c-ec4b-43d0-8a0c-c8a60921b494"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[10px] font-medium bg-primary/10 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/60 transition-colors leading-tight"
                        >
                          Get in Touch
                          <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                        </a>
                      </div>
                    </>
                  ) : m.role === "assistant" ? (
                    renderWithLinks(m.content)
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm px-3 py-1.5 bg-secondary/70 border border-border/40">
                  <span className="chatbot-loading-row text-[12px] text-muted-foreground italic">
                    <span key={loadingMsgIdx} className="chatbot-loading-text">
                      {LOADING_MESSAGES[loadingMsgIdx]}
                    </span>
                    <span className="chatbot-thinking-dots" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-2.5 bg-[color-mix(in_srgb,var(--color-surface)_85%,transparent)]">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your message…"
                rows={1}
                aria-label="Type your message"
                className="flex-1 resize-none max-h-28 rounded-xl bg-background/60 border border-border/60 px-3 py-2 text-[12.5px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 shrink-0 rounded-xl bg-primary/85 text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
