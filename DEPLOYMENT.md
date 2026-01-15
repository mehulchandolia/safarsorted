# SafarSorted Deployment Guide

## Project Structure

```
SS Website - 2.0/
├── index.html          # Main pages (GitHub Pages)
├── about.html
├── destinations.html
├── [destination].html  # 12 destination pages
├── admin.html          # Admin dashboard
├── css/
│   ├── styles.css
│   └── destinations.css
├── js/
│   ├── main.js
│   ├── backend.js
│   ├── destination-details.js
│   └── api-config.js   # API configuration
├── images/
└── backend/            # Deploy to Render separately
    ├── server.js
    ├── package.json
    └── README.md
```

---

## Step 1: Deploy Backend to Render

1. **Create a new GitHub repository** for the backend:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/safarsorted-api.git
   git push -u origin main
   ```

2. **Go to [Render.com](https://render.com)** and sign in with GitHub

3. **Create New Web Service**:
   - Select your `safarsorted-api` repository
   - Name: `safarsorted-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

4. **Add Environment Variables** (optional but recommended):
   - `ADMIN_USER` = your admin username
   - `ADMIN_PASS` = your admin password

5. **Deploy** - Wait for deployment to complete

6. **Copy your Render URL** (e.g., `https://safarsorted-api.onrender.com`)

---

## Step 2: Update Frontend API Configuration

1. Open `js/api-config.js`

2. Update the `API_BASE_URL`:
   ```javascript
   API_BASE_URL: 'https://safarsorted-api.onrender.com'
   ```

---

## Step 3: Deploy Frontend to GitHub Pages

1. **Create a GitHub repository** for the frontend:
   ```bash
   # In the main project folder (not backend)
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/safarsorted.github.io.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Save

3. **Your site will be live at**: `https://YOUR-USERNAME.github.io`

---

## Step 4: Custom Domain (Optional)

1. In GitHub repository settings, add custom domain: `safarsorted.com`

2. Add DNS records at your domain registrar:
   - **A Records**:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME**: `www` → `YOUR-USERNAME.github.io`

3. Enable "Enforce HTTPS" in GitHub Pages settings

---

## Important Notes

⚠️ **Render Free Tier**: The server may sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

⚠️ **Update CORS**: If using a custom domain, update the `cors` origins in `backend/server.js`:
```javascript
origin: ['https://safarsorted.com', 'https://www.safarsorted.com']
```

---

## Testing

1. Test form submission on your live site
2. Access admin at: `https://your-site.com/admin.html`
3. Check API health: `https://safarsorted-api.onrender.com/`

---

## File to Exclude from GitHub Pages

Create a `.gitignore` in the main folder:
```
backend/
node_modules/
.DS_Store
*.log
```
