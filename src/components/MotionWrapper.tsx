"use client";

import React from "react";
import {
  motion,
  type HTMLMotionProps,
  AnimatePresence,
  useInView,
  animate,
} from "motion/react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  distance = 36,
  ...props
}: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, filter: "blur(4px)" };
      case "down":
        return { opacity: 0, y: -distance, filter: "blur(4px)" };
      case "left":
        return { opacity: 0, x: distance, filter: "blur(4px)" };
      case "right":
        return { opacity: 0, x: -distance, filter: "blur(4px)" };
      case "none":
        return { opacity: 0, filter: "blur(4px)" };
      default:
        return { opacity: 0, y: distance, filter: "blur(4px)" };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom smooth ease-out quint
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.7,
  className = "",
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerChildren = 0.12,
  delayChildren = 0.1,
  className = "",
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({
  children,
  className = "",
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({
  children,
  amplitude = 8,
  duration = 4,
  className = "",
  ...props
}: HTMLMotionProps<"div"> & { amplitude?: number; duration?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 1.8,
  className = "",
  prefix = "",
  suffix = "",
}: CounterProps) {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-20px" });

  React.useEffect(() => {
    if (!isInView || !nodeRef.current) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (nodeRef.current) {
          nodeRef.current.textContent = `${prefix}${Math.floor(value)}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, from, to, duration, prefix, suffix]);

  return (
    <span ref={nodeRef} className={className}>
      {prefix}{from}{suffix}
    </span>
  );
}

export interface SectionStackProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
  index?: number;
  sticky?: boolean;
  fullHeight?: boolean;
}

/**
 * Signature Boutique Pinned Scroll Panel / Sticky Stacking Section
 * Pure CSS hardware-accelerated stacking & elevation shadows for buttery smooth 60-120fps scrolling.
 * On desktop (md:), locks at top: 0 with 100svh height while subsequent panels slide up and stack over it.
 */
export const SectionStack = React.forwardRef<HTMLElement, SectionStackProps>(
  function SectionStack(
    {
      children,
      className = "",
      dark = false,
      id,
      index = 1,
      sticky = true,
      fullHeight = true,
      style,
      ...props
    },
    ref
  ) {
    const stickyClasses = sticky ? "relative md:sticky md:top-0" : "relative";
    const heightClasses = fullHeight
      ? "h-auto py-8 xs:py-10 sm:py-12 md:min-h-[100svh] md:h-auto md:min-h-screen md:py-8 lg:py-0 flex flex-col justify-center"
      : "relative";

    return (
      <section
        ref={ref}
        id={id}
        style={{
          zIndex: index,
          ...style,
        }}
        className={`w-full ${stickyClasses} ${heightClasses} ${
          sticky ? (dark ? "section-stack-dark" : "section-stack") : ""
        } ${className}`}
        {...props}
      >
        {children}
      </section>
    );
  }
);
SectionStack.displayName = "SectionStack";

export { motion, AnimatePresence, useInView };

