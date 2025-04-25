import express from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

export const rateLimitMiddleware = (app: express.Application) => {
  app.use(limiter);
};
