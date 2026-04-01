/**
 * Shared SVG icon library for SkillBridge.
 * Usage: import { IconName } from "./Icons";
 *        <IconName size={18} />
 */

const defaultProps = { size: 18, className: "", style: {} };
const svgBase = (size, className, style) => ({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `sb-icon ${className}`,
    style: { display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style },
});

export function IconTarget({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

export function IconBuilding({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
        </svg>
    );
}

export function IconMapPin({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export function IconClock({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

export function IconMessageCircle({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
    );
}

export function IconSearch({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

export function IconBell({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
    );
}

export function IconClipboard({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
    );
}

export function IconMail({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="22 7 12 13 2 7" />
        </svg>
    );
}

export function IconInbox({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
        </svg>
    );
}

export function IconHand({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M18 11V6a2 2 0 00-4 0v1M14 10V4a2 2 0 00-4 0v6M10 10V6a2 2 0 00-4 0v8l-1.46-1.46a2 2 0 00-2.83 2.83L7.5 21H18a2 2 0 002-2v-5.5a2 2 0 00-2-2h0" />
        </svg>
    );
}

export function IconBridge({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M4 18h16" />
            <path d="M4 14c0-4 4-6 8-6s8 2 8 6" />
            <path d="M8 14V9M16 14V9" />
            <path d="M4 14v4M20 14v4" />
        </svg>
    );
}

export function IconEdit({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

export function IconFileText({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

export function IconUser({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function IconCheck({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export function IconX({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export function IconPlus({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

export function IconArrowLeft({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    );
}

export function IconSend({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    );
}

export function IconTrash({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
    );
}

export function IconUsers({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
    );
}

export function IconExternalLink({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    );
}

export function IconSkill({ size = 18, className = "", style = {} }) {
    return (
        <svg {...svgBase(size, className, style)}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
