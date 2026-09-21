/**
 * Telegram alert for new submissions.
 *
 * Sent through the Bot API with `fetch`, so there is no SDK and no extra
 * dependency. Telegram charges nothing for bot messages at any volume, and
 * the alert arrives as a phone push.
 *
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to switch it on; see
 * .env.example for how to obtain both. With either unset the form still
 * works and the submission is still stored — only the alert is skipped.
 */
import { SUBMISSION_TYPES } from '@/lib/submission-types';

/** The Bot API rejects anything longer; a little headroom keeps it safe. */
const MAX_MESSAGE_CHARS = 4000;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '').replace(/\/+$/, '');

export const isNotifyConfigured = Boolean(botToken && chatId);

/** Telegram's HTML parse mode needs these three escaped, and only these. */
function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function labelFor(type) {
    return SUBMISSION_TYPES[type] || SUBMISSION_TYPES.enquiry;
}

function headingFor({ type, name }) {
    const who = name || 'someone';
    if (type === 'application') return `👤 New application from ${who}`;
    if (type === 'support') return `🛠 New support ticket from ${who}`;
    return `📩 New enquiry from ${who}`;
}

/** Only the fields this submission actually carries, in a readable order. */
function rowsFor({ type, email, phone, company, subject, role, details, products, resumeName }) {
    return [
        ['Type', labelFor(type)],
        ['Email', email],
        ['Phone', phone],
        ['Company', company],
        ['Subject', subject],
        ['Role', role],
        ['Products', products?.length ? products.join(', ') : null],
        ['CV', resumeName],
        ['Message', details],
    ].filter(([, value]) => value);
}

/**
 * Escapes a value and fits it into `room` characters.
 *
 * The budget is measured after escaping, because that is what Telegram counts
 * and it is not the raw length: a single `&` becomes five characters, so a
 * body of them would overrun a budget spent on the unescaped text. Cutting an
 * escaped string can leave a half-written entity on the end, which the Bot API
 * would reject, so any trailing partial entity goes with it.
 */
function clip(value, room) {
    const escaped = escapeHtml(value);
    if (escaped.length <= room) return escaped;

    return `${escaped.slice(0, room - 1).replace(/&[a-z]*$/, '')}…`;
}

/**
 * Assembles the message within Telegram's length cap. A row that does not fit
 * is cut rather than dropped, since the long one is always the message body
 * and a clipped body still says enough to act on — the full text is in the
 * panel either way.
 */
function buildMessage(submission) {
    const footer = siteUrl ? `\n\n<a href="${escapeHtml(siteUrl)}/master">Open the panel</a>` : '';
    const heading = `<b>${clip(headingFor(submission), 300)}</b>`;

    let remaining = MAX_MESSAGE_CHARS - heading.length - footer.length - 2;
    const lines = [];

    for (const [label, value] of rowsFor(submission)) {
        // "<b>", "</b> ", the colon and the newline joining this row on.
        const prefix = `<b>${escapeHtml(label)}:</b> `;
        const overhead = prefix.length + 1;
        if (remaining <= overhead + 1) break;

        const body = clip(value, remaining - overhead);
        lines.push(`${prefix}${body}`);
        remaining -= overhead + body.length;
    }

    return `${heading}\n\n${lines.join('\n')}${footer}`;
}

/**
 * Sends the alert. Never throws: the row is already stored by the time this
 * runs, so a notification that fails must not turn a saved submission into a
 * failed one. The reason goes to the server log instead.
 */
export async function notifySubmission(submission) {
    if (!isNotifyConfigured) {
        console.warn('[notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set; no alert sent.');
        return { ok: false, skipped: true };
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: buildMessage(submission),
                parse_mode: 'HTML',
                link_preview_options: { is_disabled: true },
            }),
        });

        if (!response.ok) {
            console.error(`[notify] Telegram rejected the alert (${response.status}): ${await response.text()}`);
            return { ok: false };
        }

        return { ok: true };
    } catch (err) {
        console.error('[notify] Could not reach Telegram:', err);
        return { ok: false };
    }
}
