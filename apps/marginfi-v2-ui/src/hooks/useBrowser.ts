import React, { useEffect, useState } from "react";
import { useOs } from "./useOs";

export type BrowserTypes =
  | "Chrome"
  | "Safari"
  | "Opera"
  | "Firefox"
  | "Edge"
  | "Brave"
  | "Phantom"
  | "Backpack"
  | "PWA";

export const useBrowser = () => {
  const [browser, setBrowser] = useState<BrowserTypes>();
  const { isAndroid, isIOS, isPWA } = useOs();
  const isInAppPhantom = window.localStorage.walletName === "Phantom";
  const isInAppBackpack = window?.backpack?.isBackpack;

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (isPWA) {
      setBrowser("PWA");
    } else if (isInAppPhantom) {
      setBrowser("Phantom");
    } else if (isInAppBackpack) {
      setBrowser("Backpack");
    } else if (isAndroid) {
      setBrowser(getAndroidBrowser(userAgent));
    } else if (isIOS) {
      setBrowser(getIosBrowser(userAgent));
    } else {
      setBrowser("Chrome");
    }
  }, [isAndroid, isIOS, isInAppBackpack, isInAppPhantom, isPWA]);

  return browser;
};

const getAndroidBrowser = (userAgent: string): BrowserTypes => {
  if (/Chrome/.test(userAgent) && /Android/.test(userAgent)) {
    return "Chrome";
  } else if (/Firefox/.test(userAgent) && /Android/.test(userAgent)) {
    return "Firefox";
  } else if (/Opera|OPR/.test(userAgent) && /Android/.test(userAgent)) {
    return "Opera";
  } else if (/EdgA/.test(userAgent) || /Edge/.test(userAgent)) {
    return "Edge";
  } else if (/Brave/.test(userAgent)) {
    return "Brave";
  } else {
    return "Chrome";
  }
};

const getIosBrowser = (userAgent: string): BrowserTypes => {
  if (/CriOS/.test(userAgent)) {
    return "Chrome";
  } else if (/FxiOS/.test(userAgent)) {
    return "Firefox";
  } else if (/OPiOS/.test(userAgent)) {
    return "Opera";
  } else if (/EdgiOS/.test(userAgent) || /Edge/.test(userAgent)) {
    return "Edge";
  } else if (/Brave/.test(userAgent)) {
    return "Brave";
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    return "Safari";
  } else if (/Chrome/.test(userAgent)) {
    return "Chrome";
  } else {
    return "Chrome";
  }
};