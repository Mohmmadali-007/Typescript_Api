import { Sequelize, Options } from "sequelize";
const nodeEnv: string = process.env.NODE_ENV || "";

let optionsObj: object = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  timezone: process.env.TIME_ZONE, // Default `+00:00` to manage data as per timezone
  freezeTableName: true,
  benchmark: true,
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
  // SQLite only
  storage: "path/to/database.sqlite",
};

if (nodeEnv && nodeEnv === "production") {
  optionsObj = { logging: false };
}
const options: Options = optionsObj;

export const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME || "test",
  process.env.DB_USERNAME || "test",
  process.env.DB_PASSWORD || "test",
  optionsObj
);

if (process.env.DEBUG === "true") {
  // sequelize.sync({ force: false, alter: true });
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully..");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
}
