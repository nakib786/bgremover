# Aurora BgRemover - AI-Powered Image Editor

A comprehensive AI-powered image editing application with 15 advanced features powered by remove.bg API.

## 🌟 Features

### 1. **Background Removal**
- Remove backgrounds from images with AI precision
- Perfect for product photos, portraits, and creating transparent images
- Default feature with high-quality results

### 2. **Magic Brush**
- Manually refine background removal with precision brush tools
- Uses ROI (Region of Interest) for targeted editing
- Paint to keep or remove specific areas

### 3. **Custom Background**
- Replace backgrounds with your own images
- Upload custom background images
- Create stunning compositions with perfect blending

### 4. **Blur Background**
- Create professional depth-of-field effects
- Blur the background while keeping the subject sharp
- Adjustable blur intensity (1-10)

### 5. **AI Shadow**
- Add realistic shadows to your subjects
- Multiple shadow types: Natural, Drop Shadow, Soft Shadow
- Adjustable shadow opacity (10-100%)
- Perfect for product photography

### 6. **Product Photo Editor**
- Optimize product images for e-commerce
- Specialized for different product types (clothing, electronics, furniture, jewelry)
- Automatic cropping and shadow addition
- Professional e-commerce ready results

### 7. **Batch Editing**
- Process multiple images at once (up to 10 images)
- Parallel processing for faster results
- Individual download buttons for each result
- Progress tracking and error handling

### 8. **Background Color**
- Replace backgrounds with solid colors
- Color picker with preset options
- Perfect for consistent branding
- Supports any hex color value

### 9. **Video Background Removal**
- Remove backgrounds from video frames
- Extract and process video frames
- Create transparent videos
- Supports MP4, WebM, and OGG formats

### 10. **Logo Background Removal**
- Specialized for logos and graphics
- Preserves crisp edges and transparency
- Optimized for text and graphic elements
- Perfect for branding materials

### 11. **Sky Replacer**
- Replace skies in landscape photos
- Multiple sky presets: Clear Blue, Cloudy, Sunset, Dramatic
- Custom sky image upload option
- ROI focusing on sky areas

### 12. **Signature Background Removal**
- Clean up scanned signatures and handwritten text
- Remove paper backgrounds for digital use
- Optimized for text and signature elements
- Perfect for document processing

### 13. **CV Photo Creator**
- Create professional headshots for resumes
- Multiple background options (White, Light Gray, Light Blue, Transparent)
- Different crop styles (Passport, Professional Headshot, Square)
- Professional portrait optimization

### 14. **Car Photo Editor**
- Specialized for automotive photography
- Add realistic car shadows
- Semi-transparent window options
- Automotive-specific processing

### 15. **YouTube Thumbnail Creator**
- Design eye-catching YouTube thumbnails
- Multiple background options (Transparent, Gradient, Solid Color, Custom)
- Optimized scaling and positioning
- Perfect for content creators

## 🚀 Getting Started

### Prerequisites
- Node.js (for API functionality)
- Remove.bg API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bgremover
```

2. Install dependencies:
```bash
npm install
```

3. Set up your remove.bg API key:
   - Create a `.env` file in the root directory
   - Add your API key: `REMOVE_BG_API_KEY=your_api_key_here`
   - Get your API key from [remove.bg](https://www.remove.bg/api)

4. Start the application:
```bash
python -m http.server 3000
```

5. Open your browser and navigate to `http://localhost:3000`

## 💡 Usage

1. **Select a Feature**: Click on any of the 15 feature tabs at the top
2. **Configure Options**: Adjust feature-specific settings (color, intensity, type, etc.)
3. **Upload Image**: Drag and drop or click to upload your image
4. **Process**: The AI will process your image with the selected feature
5. **Download**: Download your processed image

### File Size Limits
- Images: Maximum 5MB
- Videos: Maximum 50MB
- Batch: Up to 10 images, 5MB each

## 🎨 Features in Detail

### Background Color Options
- White (#ffffff)
- Black (#000000)
- Red (#ff0000)
- Green (#00ff00)
- Blue (#0000ff)
- Yellow (#ffff00)
- Custom color picker

### Shadow Types
- **Natural**: Realistic ground shadows
- **Drop Shadow**: Classic drop shadow effect
- **Soft Shadow**: Subtle soft shadows

### Product Types
- General Product
- Clothing
- Electronics
- Furniture
- Jewelry

### CV Photo Backgrounds
- White (professional)
- Light Gray (modern)
- Light Blue (friendly)
- Transparent (versatile)

## 🔧 Technical Details

### API Parameters Used
- `size`: Image output size (auto)
- `format`: Output format (PNG/ZIP)
- `type`: Subject type (person/product/car/graphic)
- `bg_color`: Background color (hex)
- `bg_image_file`: Custom background image
- `crop`: Auto-cropping
- `crop_margin`: Crop margin percentage
- `scale`: Image scaling
- `position`: Subject positioning
- `roi`: Region of Interest
- `shadow_type`: Shadow style
- `shadow_opacity`: Shadow transparency
- `semitransparency`: Semi-transparent elements

### Error Handling
- File size validation
- Format validation
- API error handling
- Network error recovery
- User-friendly error messages

## 🎯 Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📱 Mobile Responsive
- Horizontal scrolling tabs on mobile
- Touch-friendly interface
- Optimized for all screen sizes

## 🔒 Privacy
- Images are processed securely via remove.bg API
- No images are stored on our servers
- All processing happens in real-time

## 📄 License
This project uses the remove.bg API. Please refer to their terms of service for usage guidelines.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support
For issues or questions, please open an issue in the repository.

---

**Powered by [remove.bg](https://www.remove.bg) API** 