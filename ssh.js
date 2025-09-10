const fs = require('fs');
const { createTunnel } = require('tunnel-ssh');

const projectName = process.env.NAME || "config";

const config = require(__dirname + `/config/${projectName}.json`);

const timelogger = function(type, msg='', msgDetail='', ...args){
  try{
    let days = new Date();
    var year = days.getFullYear();
    var month = ('0' + (days.getMonth() + 1)).slice(-2);
    var day = ('0' + days.getDate()).slice(-2);
    var hours = ('0' + days.getHours()).slice(-2);
    var minutes = ('0' + days.getMinutes()).slice(-2);
    var seconds = ('0' + days.getSeconds()).slice(-2);
    const log_date = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    if (type === "ERROR" || type.indexOf("ERR")>0 || type === "ROLLBACK") {
      console.error(`${log_date} [${type}] - `, msg, msgDetail, ...args);
    } else {
      console.log(`${log_date} [${type}] - `, msg, msgDetail, ...args);
    }
  } catch(e){
    console.error(`[ERROR] - `, e, msg, msgDetail, ...args);
  }
}

const tunnelConfig = {
  host: config.host,                                  // SSH 접속 host
  port: config.sshport,                               // SSH 통신 포트
  username: config.username,                          // SSH 접속 계정
  password: config.password,                          // SSH 접속 password
  privateKey: config.password ? null : fs.readFileSync(`./key/${config.keyfile}`),
  dstHost: config.dsthost,                            // SSH에서 통신할 곳
  dstPort: config.dstport,                            // SSH에서 통신할 포트
  localHost: '127.0.0.1',                             // 로컬 포워딩 호스트
  localPort: config.localport,                        // 로컬 포워딩 포트
  keepAlive: true,
};

function openTunnel() {
  return new Promise(async (resolve, reject) => {
    let [server, conn] = await createTunnel({
      "autoClose": false
    }, {
      "port": tunnelConfig.localPort
    }, {
      "host": tunnelConfig.host,
      "port": tunnelConfig.port,
      "username": tunnelConfig.username,
      "password": tunnelConfig.password,
      ...(tunnelConfig.privateKey && { "privateKey": tunnelConfig.privateKey}),
      "keepaliveInterval": 10000, // 10초마다 keepalive 패킷 전송
      "keepaliveCountMax": 5,     // 5번 실패하면 종료
      "readyTimeout": 30000,      // SSH 연결 대기 시간 (기본: 20초)
    }, {
      "dstAddr": tunnelConfig.dstHost,
      "dstPort": tunnelConfig.dstPort,
      "srcAddr": "127.0.0.1",
      "srcPort": tunnelConfig.dstPort,
    })
    .catch(e=>{
      reject(e);
    });
    console.log(`✅ SSH Tunnel established on name:${projectName} localhost:${tunnelConfig.localPort} > ${tunnelConfig.host} > ${tunnelConfig.dstHost}:${tunnelConfig.dstPort}`);
    resolve(server);
  });
}

// 실행 후 계속 대기 (Ctrl+C로 종료 가능)
openTunnel()
.then(() => {
  console.log('  → Tunnel is active. Press Ctrl+C to close.');
  setInterval(() => {}, 1000 * 60); // 1분마다 아무것도 안 하는 무한 루프
})
.catch((err) => {
  console.error('❌ Failed to establish SSH tunnel:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err, promise) => { timelogger('PRCERROR', '미처리된 거부: ', err); });
process.on('uncaughtException',(err)=>{ timelogger('PRCERROR', 'ERROR_Exception', err); });
process.on('SIGTERM', () => { timelogger('SIG', 'Received SIGTERM');  process.exit(0); });
process.on('SIGINT', () => { timelogger('SIG', 'Received SIGINT');  process.exit(0); });  