# FleekNote - Minimalist Note-Taking Application

**Repositories:**
- [Frontend](https://github.com/Abulkosim/fleeknote-frontend/)
- [Backend](https://github.com/Abulkosim/fleeknote-backend)

## Overview
A fast, minimalistic web-based note-taking application that provides a native app-like experience. The focus is on simplicity, speed, and reliability for quick notes and blog posts.

## Core Features

### Unauthorized Users
- Single note workspace
- Local storage persistence
- Basic editing capabilities

### Authorized Users
- Multiple notes management
- Custom URL: `fleeknote.com/username`
- Two-panel layout:
  - Left: Note list/menu
  - Right: Current note editor
- Full CRUD operations (Create, Read, Update, Delete)
- Public note sharing
- Minimalist blogging platform
- Access via: `fleeknote.com/username/note_id`

## Technical Stack

### Frontend
- Vue.js 3
- Composition API
- TypeScript

### Backend
- Express.js
- MongoDB
- MongoDB Atlas Cloud

## Implementation Phases

### Phase 1
- [+] Basic application setup
- [+] Authentication system
- [+/-] Note editor implementation
- [+] Local storage integration
- [+] Database setup and integration
- [+] Basic CRUD operations

### Phase 2
- [+] Public note sharing
- [+] Blog post functionality
- [+] User profiles
- [-] Advanced editing features 