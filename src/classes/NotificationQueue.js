const Queue = require("bull");
const redisConfig = require("../configs/libs/redis.js");
const jobs = require("../jobs/index.js");
const Logger = require("./Logger.js");
const logger = new Logger();

// Create a queue for each job
const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, {redis: redisConfig}),
    name: job.key,
    options: job.options,
    handle: job.handle,
}));

module.exports = {
    queues,
    add(name, data) {
        const queue = this.queues.find(queue => queue.name === name);
        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', (job, err) => {
                logger.error({
                    message: `Job ${queue.name} failed: ${err.message}`,
                    project: "Queue"
                })
            })
        })
    }
};