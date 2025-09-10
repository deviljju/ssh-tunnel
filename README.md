# 🧬 SSH 터널링 서비스

Latest Update: v1.0

**ssh-tunnel**는 RSA 형식이 아닌(OPENSSH) pem 파일로 SSH 터널링을 하려고 작성했습니다.

> Node.js  
> 마지막 업데이트 시간 : 2025.09.09

---

## ✨ 주요 기능

- ✅ privateKey와 접속 정보로 프로그램이 종료될 때까지 SSH 터널링 오픈
---

## 📦 기술 스택

- **Node.js**
- **tunnel-ssh** (SSH 터널링)

## 🏁 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
$ git clone https://github.com/deviljju/ssh-tunnel.git
$ cd sshTunnel
```
### 2. 패키지 설치
```bash
$ npm i
```
### 3. 환경변수(.env) 설정 및 config 폴더 내 파일 세팅

#### pem 파일로 인증을 하고자 하면 key 폴더 내에 파일을 넣는다.

#### _**/config/config.json**_
```jsonc
{
  "host": "1.2.3.4", // SSH 접속 host
  "sshport": 22,     // SSH 접속 통신 포트
  "username": "deviljju", // SSH 접속 username
  "password": "password", // SSH 접속 계정의 비밀번호, pem 등 key로 접근하려면 "" 공백으로 입력
  "keyfile": "config.pem", // SSH 접속 인증 key 파일명 /key/ 폴더 내에 해당 파일이 있어야함. password가 공백이면 keyfile을 읽지 않음
  "dsthost": "5.6.7.8", // SSH로 접속한 서버에서 통신할 host
  "dstport": 5432,        // SSH로 접속한 서버에서 통신할 host의 port
  "localport": 3007       // dsthost로 매핑할 내 컴퓨터 localhost의 port
}
```
#### **설명**
```
localhost:3007 로 통신하면
1.2.3.4:22 서버로 SSH 통신을 하고
해당 서버에서 5.6.7.8:5432로 통신을 함

명령어로 풀면 아래와 같다(한줄임)

$ ssh -i C:\Users\USER\Downloads\sshTunnel\key/config.pem -N -L 3307:5.6.7.8:5432 deviljju@1.2.3.4

```
#### 접속할 서버별로 json 파일과 pem 파일명을 같이 하여 관리해야 한다.
#### _**/config/myServer.json**_
```jsonc
{
  "host": "1.2.3.4", // SSH 접속 host
  "sshport": 22,     // SSH 접속 통신 포트
  "username": "deviljju", // SSH 접속 username
  "keyfile": "config.pem", // SSH 접속 인증 key 파일명 /key/ 폴더 내에 해당 파일이 있어야함. password가 공백이면 keyfile을 읽지 않음
  "dsthost": "5.6.7.8", // SSH로 접속한 서버에서 통신할 host
  "dstport": 5432,        // SSH로 접속한 서버에서 통신할 host의 port
  "localport": 3007       // dsthost로 매핑할 내 컴퓨터 localhost의 port
}
```
#### _**/key/myServer.pem**_
```text
-----BEGIN OPENSSH PRIVATE KEY-----
myServer PEM 파일
-----END OPENSSH PRIVATE KEY-----
```
## 프로그램 실행
🔹 config는 default 명이라 npm run start 를 하면 config.json, config.pem 파일을 load 한다

🔹 실행 시 환경변수 세팅이 귀찮으면 dotenv 모듈을 설치하고 .env 파일의 NAME을 넣어두면 됨.

### .env ###
```bash
NAME="myServer"
```
### ✅ 1. 리눅스 / macOS (bash/zsh 등)
```bash
> NAME=config npm run start
```
### ✅ 2. Window (CMD)
```bash
> set NAME=config && npm run start
```
---
작성자 : deviljju
