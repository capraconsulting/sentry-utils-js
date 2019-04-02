import { getCurrentEnvironment } from './services/env-service';
import makeThrottleByMeanLifetime from './services/throttle-service';
import { getCurrentRelease } from './utils/release-util';

interface IDefaultSentryConfiguration {
  environment: string;
  release: string;
  dsn: string;
  beforeSend: (e: any) => any | null;
}

interface IRequiredConfiguration {
  appName: string;
  appVersion: string;
  isProd?: boolean;
  sentryDsn: string;
}

export function getDefaultConfiguration({
  appName,
  appVersion,
  isProd = false,
  sentryDsn
}: IRequiredConfiguration): IDefaultSentryConfiguration {
  const throttle = makeThrottleByMeanLifetime(60 * 1000, 4);

  return {
    beforeSend: event => (throttle() ? event : null),
    dsn: sentryDsn,
    environment: getCurrentEnvironment(isProd),
    release: getCurrentRelease(appName, appVersion)
  };
}

export function getBuildTime(): string | null {
  return null;
}

export function isSentryEnabled(sentryDsn?: string): boolean {
  return typeof sentryDsn === 'string' && sentryDsn.length > 0;
}
