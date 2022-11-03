import mongoose from "mongoose";
import app from "./app";
import queue, { defineJob, cancelJob, repeatJob } from "./queue";
import fetchQuotesProcessor from "./processors/fetchQuotes.processor";
import { Env, ValidQuoteCurrenies } from "./config";
import { logger } from "./utils";

mongoose.connect(Env.MONGO_URL).then(() => {
  logger.info("Connected to MongoDB");

  app.listen(Env.PORT, () => {
    logger.info(`Listening to port ${Env.PORT}`);
  });

  queue.start().then(async () => {
    logger.info("Connected to job queue");

    defineJob("fetchQuotes", fetchQuotesProcessor);

    await cancelJob("fetchQuotes");
    await Promise.all(
      ValidQuoteCurrenies.map((quoteCurrency) =>
        repeatJob(
          "fetchQuotes",
          { quoteCurrency, attempt: 0 },
          "30 minutes",
          "quoteCurrency"
        )
      )
    );

    logger.info("Jobs started");
  });
});
