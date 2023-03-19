import { useConfig } from "~/lib/composables/useConfig";
import { useBackendData } from "~/store/backendData";

export function authUrl(user: string) {
  return useConfig().authHost + "/" + user;
}

export function forumUrl(topicId: number) {
  return `https://forums.papermc.io/threads/` + topicId;
}

export function forumUserUrl(name: number | string) {
  // TODO fixme?
  return `https://forums.papermc.io/members/` + name;
}

const isSafeHost = (host: string) => {
  for (const safeHost of useBackendData.security.safeDownloadHosts) {
    // Make sure it's the full host or a subdomain
    if (host === safeHost || host.endsWith("." + safeHost)) {
      return true;
    }
  }
  return false;
};

const isSafe = (urlString: string) => {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    if (url.protocol?.startsWith("mailto")) {
      return true;
    } else if (!host || isSafeHost(host)) {
      return true;
    }
  } catch {}

  return false;
};

export const linkout = (urlString: string) => (isSafe(urlString) ? urlString : "/linkout?remoteUrl=" + encodeURIComponent(urlString));
export const proxyImage = (urlString: string) => (isSafe(urlString) ? urlString : useBackendData.security.imageProxyUrl.replace("%s", urlString));
