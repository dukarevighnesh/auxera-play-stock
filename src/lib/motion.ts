import type { Transition } from "framer-motion";

export const snappyTransition: Transition = {
  type: "tween",
  ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
  duration: 0.2,
};
