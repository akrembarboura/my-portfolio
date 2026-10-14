import * as React from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

const WAVE_PATH =
  'M0 30 Q75 0 150 30 T300 30 T450 30 T600 30 T750 30 T900 30 T1050 30 T1200 30 V60 H0 Z';

function Wave({
  color,
  height,
  duration,
  reverse,
  opacity,
  reduced,
}) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className="absolute bottom-full left-0 w-[200%] pointer-events-none"
      style={{
        height,
        marginBottom: -1,
        opacity,
      }}
      animate={
        reduced
          ? undefined
          : {
              x: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
            }
      }
      transition={
        reduced
          ? undefined
          : {
              duration,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            }
      }
    >
      <path d={WAVE_PATH} fill={color} />
    </motion.svg>
  );
}

export default function LiquidFillButton({
  children,
  href,
  color = '#2563eb', // Vibrant blue
  fillTextColor = '#ffffff',
  idleLevel = 0.14, // Idle liquid level at bottom so waves run continuously
  waveHeight = 4, // Subtle wave height below text at rest
  waveDuration = 2.4,
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}) {
  const reducedMotion = useReducedMotion();
  const restLevel = reducedMotion ? 0 : idleLevel;
  const fill = useMotionValue(restLevel);

  // Height of the liquid rectangle
  const liquidHeight = useTransform(fill, (v) => `${Math.max(v, 0) * 100}%`);

  // Inverted text reveal overlay matching liquid rise
  const textClip = useTransform(
    fill,
    (v) => `inset(${Math.max(1 - v, 0) * 100}% 0 0 0)`
  );

  const hoverRef = React.useRef(false);
  const focusRef = React.useRef(false);
  const clickedRef = React.useRef(false);
  const clickTimeoutRef = React.useRef(null);

  const sync = React.useCallback(() => {
    const target =
      hoverRef.current || focusRef.current || clickedRef.current ? 1 : restLevel;
    if (reducedMotion) {
      fill.set(target);
      return;
    }
    animate(fill, target, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });
  }, [fill, reducedMotion, restLevel]);

  const handleMouseEnter = (e) => {
    onMouseEnter?.(e);
    hoverRef.current = true;
    sync();
  };

  const handleMouseLeave = (e) => {
    onMouseLeave?.(e);
    hoverRef.current = false;
    sync();
  };

  const handleFocus = (e) => {
    onFocus?.(e);
    focusRef.current = true;
    sync();
  };

  const handleBlur = (e) => {
    onBlur?.(e);
    focusRef.current = false;
    clickedRef.current = false;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    sync();
  };

  const handleClick = (e) => {
    onClick?.(e);
    clickedRef.current = true;
    sync();

    // After clicking, hold the wave up then smoothly return to running waves unless hovered
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      clickedRef.current = false;
      sync();
    }, 1200);
  };

  React.useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const baseStyles = {
    backgroundColor: 'var(--text-1)',
    color: 'var(--bg-0)',
    ...style,
  };

  const commonProps = {
    className: `relative isolate overflow-hidden ${className}`,
    style: baseStyles,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onClick: handleClick,
    ...props,
  };

  const content = (
    <>
      {/* 1. Base label at rest */}
      <span className="relative z-10">{children}</span>

      {/* 2. Liquid layer with running waves */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: liquidHeight,
        }}
      >
        {/* Background wave (subtle, offset, reversed) */}
        <Wave
          color={color}
          height={waveHeight * 1.3}
          duration={waveDuration * 1.6}
          reverse={true}
          opacity={0.35}
          reduced={Boolean(reducedMotion)}
        />

        {/* Foreground wave (crisp, primary) */}
        <Wave
          color={color}
          height={waveHeight}
          duration={waveDuration}
          reverse={false}
          opacity={1}
          reduced={Boolean(reducedMotion)}
        />

        {/* Liquid body */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: color }}
        />
      </motion.div>

      {/* 3. Clipped inverted text layer revealed by rising liquid */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center font-semibold text-[0.85rem]"
        style={{
          clipPath: textClip,
          color: fillTextColor,
        }}
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    return <a href={href} {...commonProps}>{content}</a>;
  }

  return <button type="button" {...commonProps}>{content}</button>;
}
