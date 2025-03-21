module.exports = {
    apps: [
      {
        name: "phan-chau-trinh-system",
        script: "npm",
        args: "start",
        env_production: {
          NODE_ENV: "production",
          PORT: 3000,
        },
      },
    ],
  };
  