import { CE_PINO_DEFAULT_VALUE } from '#/loggings/pino/const-enum/CE_PINO_DEFAULT_VALUE';
import pathe from 'pathe';
import pino, { type TransportMultiOptions } from 'pino';

export function makePinoTransport(level?: string, dirname?: string, filename?: string) {
  return pino.transport({
    targets: [
      // console transport
      {
        target: 'pino/file',
        options: { destination: 1 }, // this writes to STDOUT
      },
      // file transport
      {
        level: level ?? CE_PINO_DEFAULT_VALUE.LEVEL,
        target: filename ?? CE_PINO_DEFAULT_VALUE.FILENAME,
        options: {
          destination: dirname ?? pathe.join(process.cwd(), CE_PINO_DEFAULT_VALUE.LOCAL_DIR),
        },
      },
    ],
    levels: pino.levels.values,

    // level: getPinoLevel(level),
    // dirname: dirname ?? CE_WINSTON_DEFAULT_VALUE.LOCAL_DIR,
    // filename: filename ?? CE_WINSTON_DEFAULT_VALUE.FILENAME,
    // format: formatter ?? getFormatter(),
    // eol: os.EOL,
  }) as TransportMultiOptions;
}
