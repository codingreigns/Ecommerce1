function killerFunction(server) {
  const exitHandler = () => {
    if (server) {
      console.log("Server closed");
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  //SIGTERM
  process.on("SIGTERM", () => {
    if (server) {
      console.log("SIGTERM received shutting down gracefully");
      process.exit(1);
    }
  });
}

module.exports = killerFunction;
