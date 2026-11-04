"use client";

import { useSyncExternalStore } from "react";

import { getVisitorTimeZone } from "@/lib/calendar";

// Nothing external changes these snapshots, so there is nothing to subscribe to.
const subscribe = () => () => {};

const getServerTimeZone = () => "UTC";
const getServerMounted = () => false;
const getClientMounted = () => true;

/**
 * The server cannot know the visitor's timezone, so React renders the UTC
 * snapshot for SSR and hydration and then switches to the browser's zone.
 */
export function useVisitorTimeZone() {
  return useSyncExternalStore(subscribe, getVisitorTimeZone, getServerTimeZone);
}

/** `false` for SSR and hydration, `true` once the browser takes over. */
export function useHasMounted() {
  return useSyncExternalStore(subscribe, getClientMounted, getServerMounted);
}
