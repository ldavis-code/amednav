import React from 'react';

/*
 * AMedNav wordmark.
 *
 * Four moves make this mark work: Instrument Serif typeface, italic coral "e",
 * no space between letters, small superscript ™. The italic "e" is doing three
 * jobs at once — separating AM from dNav, marking "Med", and acting as a
 * built-in logomark that leans forward to suggest motion.
 *
 * Props:
 *   size      — 'sm' (24px / nav)   'md' (32px / cards)
 *               'lg' (48px / hero)  'xl' (72px / marketing)
 *               or a raw CSS size string (e.g. "2rem").
 *   onDark    — swap navy → soft white for navy / dark surfaces. Coral holds.
 *   showTm    — render the ™ superscript. Default: true.
 *   className — extra classes for layout/positioning.
 */
const SIZE_MAP = {
    sm: '1.5rem',   // 24px — nav bar
    md: '2rem',     // 32px — footer, cards
    lg: '3rem',     // 48px — section heads
    xl: '4.5rem',   // 72px — hero, marketing
};

export default function Wordmark({
    size = 'md',
    onDark = false,
    showTm = true,
    className = '',
    as: Tag = 'span',
    ...rest
}) {
    const fontSize = SIZE_MAP[size] || size;
    const classes = [
        'wordmark',
        onDark ? 'wordmark--on-dark' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <Tag
            className={classes}
            style={{ fontSize }}
            aria-label="AMedNav"
            {...rest}
        >
            {/* aria-hidden decomposition so screen readers announce "AMedNav",
                not "A-M-e-d-Nav-trademark". */}
            <span aria-hidden="true">
                AM<span className="wordmark__e">e</span>dNav
                {showTm && <span className="wordmark__tm">™</span>}
            </span>
        </Tag>
    );
}
