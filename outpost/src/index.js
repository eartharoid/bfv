import { program } from 'commander';
import { CronJob } from 'cron';
import config from './config.js';
import log from './logger.js';
import scrape from './scrape.js';

program
  .name('outpost')
  .option('-c, --cron', 'keep the process alive and run on interval', false);

program.parse(process.argv);
const options = program.opts();

log.success('Battlefield V Outpost by eartharoid (https://github.com/eartharoid/bfv)');

if (options.cron) {
  const job = CronJob.from({
    cronTime: config.cron,
    async onTick() {
      await scrape(this);
    },
  });
  log.warn('This process will run indefinitely (stop with Ctrl+C)');
  log.info('Expect first run to be at', new Date(job.nextDate().ts));
  job.start();
} else {
  log.info('Running once...');
  await scrape();
}
