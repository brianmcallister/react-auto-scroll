/**
 * Just enough fake data for log lines in the demo.
 */

const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T;

const PROTOCOLS = ['http', 'https', 'ftp', 'ws', 'wss'];
const FOLDERS = ['audio', 'image', 'text', 'video', 'application'];
const NAMES = ['ram', 'granite_glens', 'didactic', 'flat_white', 'cohesive', 'azure', 'pixel', 'quartz'];
const EXTENSIONS = ['mp3', 'mp4', 'png', 'wav', 'json', 'htm', 'pdf', 'txt'];
const TYPES = ['application/json', 'image/png', 'text/html', 'video/mp4', 'audio/mpeg', 'text/plain'];
const LOCALES = ['en_US', 'en_GB', 'de', 'fr', 'ja', 'pt_BR', 'es', 'zh_CN', 'sk', 'it'];

const version = () =>
  [0, 0, 0].map(() => Math.floor(Math.random() * 10)).join('.');

/** A line that looks like a request log entry. */
export const logLine = () =>
  [
    pick(PROTOCOLS),
    `/${pick(FOLDERS)}/${pick(NAMES)}.${pick(EXTENSIONS)}`,
    Math.floor(Math.random() * 99999),
    pick(TYPES),
    version(),
    pick(LOCALES),
  ].join(' ');
