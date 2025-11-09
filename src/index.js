const express = require("express");
const cors = require("cors");
const { PORT, NODE_ENV } = require("./utils/secrets");
const ConnectDB = require("./utils/config.database");
const router = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

if (NODE_ENV === "development") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerUser = require("./utils/api-user.json");
  // const swaggerAdmin = require("./utils/api-admin.json");

  app.use(
    "/api-docs/user",
    swaggerUi.serveFiles(swaggerUser),
    swaggerUi.setup(swaggerUser)
  );
  // app.use(
  //   "/api-docs/admin",
  //   swaggerUi.serveFiles(swaggerAdmin),
  //   swaggerUi.setup(swaggerAdmin)
  // );
}

void ConnectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: "Welcome to Shopping App by Nazirov" });
});

app.use("/", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
