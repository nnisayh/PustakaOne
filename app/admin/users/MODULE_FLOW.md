# Users Module – Layout & Flow

## Overview
Users module digunakan untuk:
- Monitoring user
- Managing user data
- Controlling access & status

---

# 🧭 Layout Structure

## 1. Header Section
- Title: Users
- Subtitle: Manage user accounts, roles, and access permissions

---

## 2. Summary Cards
Menampilkan insight cepat:

- Active Users
- Lecturers
- New Users (this month)

Purpose:
- Quick monitoring
- High-level statistics

---

## 3. User Management Section

### 3.1 Top Actions
- Edit Mode (toggle)
- Export
- Bulk Import
- Add User

---

### 3.2 Tabs (State Filter)
- All Users
- Active
- Inactive
- Blocked

Behavior:
- Switch tab → filter list otomatis

---

### 3.3 Filters
- Faculty
- Role
- Status

---

### 3.4 Search
- Search by name / email / ID

---

### 3.5 User Table

Columns:
- Name & Email
- Faculty
- Role
- Status
- Last Access
- Actions

---

### Row Actions:
- View Detail
- Edit User
- Activate / Deactivate
- Block / Unblock

---

## 4. Online Users Panel (Right Sidebar)

### Content:
- List user yang sedang online
- Avatar + Name
- Role / Category
- Last active time

### Purpose:
- Real-time monitoring
- Activity visibility

---

# 🔄 User Flow

## Main Flow
View Users → Filter/Search → Select User → Perform Action

---

## 1. View Users
- Default: All Users tab
- Summary cards memberikan overview

---

## 2. Filter & Search
- User bisa:
  - Filter by faculty / role / status
  - Search by name/email

---

## 3. Select User

### Action Options:
- View Detail → buka drawer/modal
- Edit User → update data
- Change Status:
  - Active → Inactive
  - Active → Blocked
  - Blocked → Active

---

## 4. Add User Flow

Click "Add User" → Open Form → Input Data → Assign Role → Save

Fields:
- Name
- Email
- Faculty
- Role (including Admin)
- Status

---

## 5. Bulk Actions

(ketika multi-select aktif)
- Activate selected users
- Deactivate users
- Block users
- Export selected

---

## 6. Status Logic

- Active → user bisa akses sistem
- Inactive → user tidak aktif sementara
- Blocked → user dibatasi akses (security)

---

## 7. Real-time Monitoring

Online panel:
- Update otomatis
- Menampilkan user aktif saat ini

---

# 🧠 System Logic

User = Identity  
+ Role (Mahasiswa / Dosen / Staff / Admin)  
+ Status (Active / Inactive / Blocked)  
+ Activity (Last Access / Online)

---

# 🏁 Summary

Users module menggabungkan:
- Data management
- Access control
- Activity monitoring

Dengan flow:
Monitor → Filter → Act → Update → Track
