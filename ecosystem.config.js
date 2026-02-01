module.exports = {
  apps: [
    {
      name: 'douyin-task-system',
      script: '.next/standalone/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8890,
        API_BASE_URL: 'http://134.122.136.221:4667/api'
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 8891,
        API_BASE_URL: 'http://134.122.136.221:4667/api'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      max_memory_restart: '2G',
      restart_delay: 4000,
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      cron_restart: '0 0 * * *' // 每天凌晨重启
    }
  ]
};
