# Freelancer Helper

A Chrome extension that displays detailed freelancer information directly from the Freelancer.com API when viewing project pages.

## Features

- **Quick Profile Access**: View freelancer profiles without leaving the project page
- **Comprehensive Information**: Display key freelancer details including:
  - Profile avatar and name
  - Location and timezone
  - Registration date
  - Account verification status (payment, email, phone, identity, etc.)
  - Preferred freelancer badge
- **Clean UI**: Modern, user-friendly interface with status indicators
- **Real-time Data**: Fetches up-to-date information from Freelancer.com API

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd freelancer-helper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

1. Navigate to any Freelancer.com project page (e.g., `https://www.freelancer.com/projects/...`)
2. Click the Freelancer Helper extension icon in your Chrome toolbar
3. The extension will automatically fetch and display the project owner's information

## Project Structure

```
freelancer-helper/
├── src/
│   └── main.js          # Main extension logic
├── dist/                # Built extension files (generated)
├── public/
│   └── icon.png        # Extension icon
├── index.html          # Popup HTML
├── manifest.json       # Chrome extension manifest
├── vite.config.js     # Vite build configuration
└── package.json       # Project dependencies
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Available Scripts

- `npm run dev` - Start development server (for testing)
- `npm run build` - Build the extension for production
- `npm run preview` - Preview the built extension

### Building

The extension is built using Vite. After running `npm run build`, the compiled files will be in the `dist` directory, ready to be loaded as an unpacked extension in Chrome.

## Permissions

This extension requires the following permissions:

- **activeTab**: To access the current tab's URL
- **scripting**: To interact with the current page
- **Host permission**: Access to `https://www.freelancer.com/projects/*` to fetch project data

## How It Works

1. The extension detects when you're on a Freelancer.com project page
2. It extracts the project SEO URL from the current page URL
3. It makes API calls to Freelancer.com to fetch:
   - Project details (to get the owner ID)
   - User details (profile information, status, etc.)
4. The information is displayed in a clean, organized popup interface

## API Endpoints Used

- `https://www.freelancer.com/api/projects/0.1/projects` - Fetch project data
- `https://www.freelancer.com/api/users/0.1/users` - Fetch user profile data

## Status Indicators

The extension displays various account verification statuses:
- ✅ Payment Verified
- ✅ Email Verified
- ✅ Phone Verified
- ✅ Identity Verified
- ✅ Deposit Made
- ✅ Profile Complete
- ✅ Facebook Connected
- ✅ LinkedIn Connected
- ✅ Freelancer Verified
- ✅ Custom Charge Verified

## Browser Compatibility

- Chrome (Manifest V3)
- Other Chromium-based browsers (Edge, Brave, etc.)

## License

This project is private and not licensed for public use.

## Version

Current version: 1.0.0

## Contributing

This is a private project. For issues or suggestions, please contact the project maintainer.

