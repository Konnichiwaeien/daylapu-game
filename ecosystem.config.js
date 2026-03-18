module.exports = {
  apps: [{
    name: "daylapu-game",
    script: "npm",
    args: "start",
    cwd: "/home/daylapu-game",
    interpreter: "none",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3002,
    },
    env_dev: {
      NODE_ENV: "development",
    }
  }]
};