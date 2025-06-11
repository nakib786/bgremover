# 🎨 Background Remover Web App

A modern, responsive web application that removes backgrounds from images using the remove.bg API. Built with vanilla HTML, CSS, and JavaScript with a secure serverless backend.

## ✨ Features

- 📁 **File Upload** - Click to browse and select image files
- 🖱️ **Drag & Drop** - Drag images directly onto the upload area
- 🔗 **URL Input** - Enter image URLs to process remote images
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ✨ **Modern Animations** - Smooth transitions and loading states
- 🔒 **Secure API** - API key hidden in serverless function
- 💾 **Download Feature** - Download processed images
- ⚡ **Error Handling** - Graceful error messages

## 🔒 Security

The API key is **securely stored** in a Vercel serverless function, not exposed in the client-side code. This prevents unauthorized access to your remove.bg API key.

## 🚀 Deployment on Vercel

### Option 1: Environment Variable (Recommended)

1. Fork/clone this repository
2. Connect to Vercel
3. Add environment variable:
   - Key: `REMOVE_BG_API_KEY`
   - Value: Your remove.bg API key
4. Deploy

### Option 2: Direct Setup

1. Replace the API key in `api/remove-bg.js` with your key
2. Deploy to Vercel

## 🛠️ Local Development

1. Clone the repository
2. Set up your API key:
   ```bash
   # Create .env file
   echo "REMOVE_BG_API_KEY=your_api_key_here" > .env
   ```
3. Install Vercel CLI: `npm i -g vercel`
4. Run locally: `vercel dev`
5. Open `http://localhost:3000`

## 📁 Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles with animations
├── script.js           # Client-side JavaScript
├── api/
│   └── remove-bg.js    # Secure serverless function
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🎨 Supported Image Formats

- JPG/JPEG
- PNG
- GIF
- BMP
- WebP

## 🔧 API Configuration

Get your API key from [remove.bg](https://www.remove.bg/api) and set it up using one of the methods above.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 