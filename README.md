# INET System Engineer — Docker Container Workshop

คู่มือทำ Workshop บน Windows 11 ด้วย PowerShell และ Docker Desktop สำหรับผู้เริ่มต้น โดยจะ Build, Push, Pull และทดสอบทีละ Container

## โครงสร้างโปรเจกต์

```text
workshop-container/
├── nodejs-api/
│   ├── v0.0.1/       # Source, Dockerfile และ Compose ของ API รุ่น 0.0.1
│   └── v0.0.2/       # Source, Dockerfile และ Compose ของ API รุ่น 0.0.2
├── nginx/            # หน้าเว็บ, Dockerfile และ Compose
└── README.md
```

## เตรียมก่อนเริ่ม

1. ติดตั้งและเปิด Docker Desktop ให้สถานะ Engine พร้อมใช้งาน
2. เปิด PowerShell ที่โฟลเดอร์โปรเจกต์ ตัวอย่างคำสั่งด้านล่างใช้ path ของโปรเจกต์นี้ หากย้ายโฟลเดอร์ให้แก้ path ให้ตรงกับเครื่องของคุณ:

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container"
```

3. แก้ชื่อ Docker Hub และชื่อที่แสดงบนเว็บไซต์ก่อน Build:
   - แก้ `YOUR_DOCKERHUB_USERNAME` เป็น Docker Hub Username จริงใน `compose.yaml` ทั้ง 3 ไฟล์ และใช้ Username เดียวกันในคำสั่ง Build/Push ด้านล่าง
   - แก้ `YOUR_NAME` ใน `nginx\index.html` เป็นชื่อที่ต้องการแสดง
   - ตัวอย่างด้านล่างใช้ `YOUR_DOCKERHUB_USERNAME` เป็น placeholder เพื่อให้เปลี่ยนได้ง่าย ห้ามรันคำสั่งที่ยังมี placeholder อยู่

## Build Images

รันแต่ละคำสั่งจากโฟลเดอร์ที่ระบุ:

### Node.js API v0.0.1

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container\nodejs-api\v0.0.1"
docker build -t YOUR_DOCKERHUB_USERNAME/nodejs-api:uat-v0.0.1 .
```

### Node.js API v0.0.2

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container\nodejs-api\v0.0.2"
docker build -t YOUR_DOCKERHUB_USERNAME/nodejs-api:uat-v0.0.2 .
```

### NGINX

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container\nginx"
docker build -t YOUR_DOCKERHUB_USERNAME/nginx:uat-v0.0.1 .
```

แทนที่ `YOUR_DOCKERHUB_USERNAME` ในคำสั่งด้วย Username จริง เช่น `somchai` จะได้ Image `somchai/nodejs-api:uat-v0.0.1` จากนั้นตรวจสอบ Images:

```powershell
docker images
```

## Login และ Push ไป Docker Hub

สร้าง Repository สาธารณะหรือกำหนดค่าตามที่ผู้สอนต้องการใน Docker Hub จำนวน 2 รายการ ชื่อ `nodejs-api` และ `nginx` ภายใต้บัญชีของคุณ จากนั้น Login ใน PowerShell:

```powershell
docker login
```

ใส่ข้อมูลบัญชีหรือใช้ Docker Hub Access Token เมื่อมี prompt จากนั้น Push ทั้ง 3 Tags (แทนชื่อจริงในทุกคำสั่ง):

```powershell
docker push YOUR_DOCKERHUB_USERNAME/nodejs-api:uat-v0.0.1
docker push YOUR_DOCKERHUB_USERNAME/nodejs-api:uat-v0.0.2
docker push YOUR_DOCKERHUB_USERNAME/nginx:uat-v0.0.1
```

เปิด Docker Hub ใน Browser แล้วตรวจสอบว่า Repository `nodejs-api` มี Tags `uat-v0.0.1` และ `uat-v0.0.2` และ Repository `nginx` มี Tag `uat-v0.0.1`

## Pull, Run และทดสอบด้วย Docker Compose

ต้องแก้ Username ใน `compose.yaml` ทั้งสามไฟล์ให้ตรงกับบัญชีที่ Push Image ไว้ก่อน คำสั่งด้านล่างรันทีละตัว ใช้ Host Port 3000 สำหรับ API และ 8080 สำหรับเว็บ

### Node.js API v0.0.1

รันจาก `D:\ทดลองงาน inet\system engineer\workshop-container\nodejs-api\v0.0.1`:

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container\nodejs-api\v0.0.1"
docker compose pull
docker compose up -d
docker ps
Invoke-RestMethod http://localhost:3000/
```

ผลที่คาดหวัง: `message` เป็น `Hello from Node.js API v0.0.1` เปิด `http://localhost:3000/` ใน Browser เพื่อดู JSON ได้เช่นกัน จากนั้นหยุดก่อนเปลี่ยนรุ่น:

```powershell
docker compose down
```

### Node.js API v0.0.2

รันจาก `D:\ทดลองงาน inet\system engineer\workshop-container\nodejs-api\v0.0.2`:

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container\nodejs-api\v0.0.2"
docker compose pull
docker compose up -d
docker ps
Invoke-RestMethod http://localhost:3000/
```

ผลที่คาดหวัง: `message` เป็น `Hello from Node.js API v0.0.2` เปิด `http://localhost:3000/` ใน Browser แล้วหยุด Container:

```powershell
docker compose down
```

### NGINX

รันจาก `D:\ทดลองงาน inet\system engineer\workshop-container\nginx`:

```powershell
Set-Location "D:\ทดลองงาน inet\system engineer\workshop-container\nginx"
docker compose pull
docker compose up -d
docker ps
```

เปิด `http://localhost:8080` ใน Browser เพื่อดูหน้าเว็บ จากนั้นหยุด Container:

```powershell
docker compose down
```

`docker compose down` ในแต่ละโฟลเดอร์จะหยุดและลบ Container ของ Compose โปรเจกต์นั้นเท่านั้น การทดสอบทีละตัวช่วยให้ Port 3000 ไม่ชนกันระหว่าง API สองเวอร์ชัน

## จุดที่ต้องแคปหน้าจอส่ง Workshop

### Node.js v0.0.1

- Source Code `nodejs-api\v0.0.1\index.js`
- `nodejs-api\v0.0.1\Dockerfile`
- Terminal ขณะรัน `docker build` และผล Build สำเร็จ
- Browser ที่ `http://localhost:3000/` แสดงข้อความ v0.0.1

### Node.js v0.0.2

- Source Code `nodejs-api\v0.0.2\index.js` ที่แสดง Version ใหม่
- `nodejs-api\v0.0.2\Dockerfile` หรือ Terminal ขณะ Build Image
- Browser ที่ `http://localhost:3000/` แสดงข้อความ v0.0.2

### NGINX

- `nginx\index.html` ที่แสดงชื่อของคุณ
- `nginx\Dockerfile`
- Browser ที่ `http://localhost:8080` แสดงหน้าเว็บและชื่อ

### Docker Hub

- Terminal ขณะรันคำสั่ง `docker push` ทั้ง 3 Tags
- หน้า Repository `nodejs-api` ที่เห็น 2 Tags
- หน้า Repository `nginx` ที่เห็น 1 Tag

### Docker Compose

- `compose.yaml` ของแต่ละ Image
- ผลคำสั่ง `docker compose pull`
- ผลคำสั่ง `docker compose up -d`
- ผลคำสั่ง `docker ps`
- ผลลัพธ์ API หรือหน้าเว็บใน Browser ของแต่ละ Container

## ลำดับ Workshop โดยย่อ

1. แก้ Docker Hub Username ใน Compose และชื่อในหน้า NGINX
2. Build API v0.0.1, API v0.0.2 และ NGINX ทีละ Image แล้วตรวจ `docker images`
3. Login Docker Hub และ Push ทั้ง 3 Tags
4. ตรวจสอบ 2 Repositories และ Tags บน Docker Hub
5. Pull, Run, ทดสอบ และแคปหลักฐานของ API v0.0.1 แล้วสั่ง `docker compose down`
6. ทำซ้ำกับ API v0.0.2 แล้วสั่ง `docker compose down`
7. Pull, Run, ทดสอบ NGINX และสั่ง `docker compose down`
