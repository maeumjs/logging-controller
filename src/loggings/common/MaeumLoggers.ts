import type { IMaeumLoggers } from '#/loggings/common/interfaces/IMaeumLogger';

export abstract class MaeumLoggers {
  abstract l(rawName: string, rawFullname?: string): Readonly<IMaeumLoggers>;
}
