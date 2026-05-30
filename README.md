# 📋 Task Manager API

Node.js, Express.js ve MongoDB kullanılarak geliştirilmiş RESTful görev yönetim API'si.

## 📖 Proje Hakkında

Task Manager API, kullanıcıların görev oluşturabildiği, listeleyebildiği, güncelleyebildiği ve silebildiği bir backend uygulamasıdır.

Bu proje backend geliştirme süreçlerini öğrenmek amacıyla geliştirilmiş olup; Express.js, MongoDB Atlas, Mongoose, Middleware yapıları ve REST API prensiplerini içermektedir.

---

## 🚀 Özellikler

* Görev oluşturma
* Tüm görevleri listeleme
* ID ile görev görüntüleme
* Görev güncelleme
* Görev silme
* MongoDB Atlas entegrasyonu
* Middleware kullanımı
* RESTful API mimarisi
* Controller - Route ayrımı

---

## 🛠️ Kullanılan Teknolojiler

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Development Tools

* Nodemon
* Thunder Client
* Git & GitHub

---

## 📂 Proje Yapısı

```text
src
├── config
│   └── db.js
│
├── controllers
│   └── taskController.js
│
├── middlewares
│   ├── authMiddleware.js
│   └── loggerMiddleware.js
│
├── models
│   └── task.js
│
├── routes
│   └── taskRoutes.js
│
└── app.js
```

---

## 📌 API Endpointleri

### Görevleri Listele

```http
GET /api/tasks
```

### Tek Görev Getir

```http
GET /api/tasks/:id
```

### Yeni Görev Oluştur

```http
POST /api/tasks
```

Örnek Body:

```json
{
  "title": "Node.js öğren"
}
```

### Görev Güncelle

```http
PUT /api/tasks/:id
```

Örnek Body:

```json
{
  "completed": true
}
```

### Görev Sil

```http
DELETE /api/tasks/:id
```

---

## 🔒 Middleware Yapısı

### Logger Middleware

Gelen isteklerin:

* HTTP Method
* URL

bilgilerini terminale yazdırır.

### Auth Middleware

Authorization header kontrolü yapar.

Örnek:

```http
Authorization: secret123
```

---

## ⚙️ Kurulum

Projeyi klonlayın:

```bash
git clone <repo-url>
```

Bağımlılıkları yükleyin:

```bash
npm install
```

`.env` dosyası oluşturun:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

Uygulamayı başlatın:

```bash
npm run dev
```

---

## 🎯 Öğrenilen Konular

Bu proje kapsamında:

* Express.js
* Routing
* Controllers
* Middleware
* REST API
* CRUD İşlemleri
* MongoDB Atlas
* Mongoose
* Environment Variables (.env)
* Git ve GitHub

konularında uygulamalı deneyim kazanılmıştır.

---

## 👨‍💻 Geliştirici

Baran Doğrular

Backend geliştirme öğrenme sürecinde oluşturulmuş REST API projesi.
