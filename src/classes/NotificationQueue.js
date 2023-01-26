import Queue from "bull";
import redisConfig from "../configs/libs/redis.js";
import * as jobs from "../jobs/index.js";
import logger from "./Logger.js";

// Create a queue for each job
const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, redisConfig),
    name: job.key,
    options: job.options,
    handle: job.handle,
}));

export default {
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