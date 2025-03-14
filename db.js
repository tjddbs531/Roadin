const mysql = require('mysql2');

// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true,
});

db.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
    return;
  }
  console.log('MySQL 데이터베이스에 연결되었습니다.');

  // 데이터 조회 쿼리 실행
  db.query('SELECT * FROM trip.users', (err, results) => {
    if (err) {
      console.error('쿼리 실행 실패:', err);
      return;
    }
    // 조회된 결과 출력
    console.log('조회된 데이터:', results);
  });
});

module.exports = db;