import Redis from "ioredis";

class RedisService {
  private config: any;
  constructor() {
    this.config = {
      port: 6379,
      host: "127.0.0.1",
      username: "default",
      password: "mypass",
      db: 0,
    };
  }

  get redisInstance() {
    return new Redis(this.config);
  }
}

export default new RedisService();
