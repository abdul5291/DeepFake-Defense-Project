export function generateManifestJson(): string {
  const manifest = {
    manifest_version: 3,
    name: 'Deede - Deepfake Detector',
    version: '1.0.0',
    description: 'Real-time deepfake detection for web content',
    permissions: ['scripting', 'activeTab', 'tabs'],
    host_permissions: [
      '*://youtube.com/*',
      '*://www.youtube.com/*',
      '*://twitter.com/*',
      '*://x.com/*',
      '*://tiktok.com/*',
      '*://www.tiktok.com/*',
      '*://reddit.com/*',
      '*://www.reddit.com/*',
    ],
    action: {
      default_popup: 'popup.html',
      default_title: 'Deede Deepfake Detector',
      default_icons: {
        16: 'images/icon-16.png',
        48: 'images/icon-48.png',
        128: 'images/icon-128.png',
      },
    },
    background: {
      service_worker: 'background.js',
    },
    content_scripts: [
      {
        matches: [
          '*://youtube.com/*',
          '*://www.youtube.com/*',
          '*://twitter.com/*',
          '*://x.com/*',
          '*://tiktok.com/*',
          '*://www.tiktok.com/*',
          '*://reddit.com/*',
          '*://www.reddit.com/*',
        ],
        js: ['content_script.js'],
        run_at: 'document_end',
      },
    ],
    icons: {
      16: 'images/icon-16.png',
      48: 'images/icon-48.png',
      128: 'images/icon-128.png',
    },
  };

  return JSON.stringify(manifest, null, 2);
}

export function generateContentScriptJs(): string {
  return `
(function() {
  console.log('Deede Deepfake Detector content script loaded');

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeContent') {
      const content = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
      };
      sendResponse({ success: true, data: content });
    }
  });

  const addDetectionButton = () => {
    const button = document.createElement('button');
    button.textContent = 'Analyze with Deede';
    button.style.cssText = \`
      padding: 10px 16px;
      background-color: #00ff88;
      color: #001a00;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 12px;
      font-family: Arial, sans-serif;
      margin: 8px 0;
      transition: all 0.3s ease;
    \`;

    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#00dd77';
      button.style.boxShadow = '0 0 12px rgba(0, 255, 136, 0.4)';
    });

    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#00ff88';
      button.style.boxShadow = 'none';
    });

    button.addEventListener('click', () => {
      chrome.runtime.sendMessage(
        { action: 'analyzeContent' },
        (response) => {
          if (response.success) {
            console.log('Content analyzed:', response.data);
            alert('Content sent for analysis. Check the extension popup for results.');
          }
        }
      );
    });

    return button;
  };

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const mainContainer = document.body;
      if (mainContainer) {
        const button = addDetectionButton();
        mainContainer.insertBefore(button, mainContainer.firstChild);
      }
    } catch (e) {
      console.error('Deede: Error adding detection button', e);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const button = addDetectionButton();
      if (document.body) {
        document.body.insertBefore(button, document.body.firstChild);
      }
    });
  } else {
    const button = addDetectionButton();
    if (document.body) {
      document.body.insertBefore(button, document.body.firstChild);
    }
  }
})();
`;
}

export function generatePopupHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 400px;
      background: linear-gradient(135deg, #001a00 0%, #003300 100%);
      color: #ffffff;
      font-family: 'Courier New', monospace;
    }

    .container {
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #00ff88;
      padding-bottom: 15px;
    }

    .icon {
      width: 32px;
      height: 32px;
      background-color: #00ff88;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #001a00;
      font-weight: bold;
      font-size: 18px;
    }

    h1 {
      font-size: 18px;
      color: #00ff88;
    }

    .status {
      background-color: rgba(0, 255, 136, 0.1);
      border: 1px solid #00ff88;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 15px;
      font-size: 12px;
    }

    .status-label {
      color: #00ff88;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .status-value {
      color: #cccccc;
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: #00ff88;
      color: #001a00;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
    }

    button:hover {
      background-color: #00dd77;
      box-shadow: 0 0 12px rgba(0, 255, 136, 0.4);
    }

    button:active {
      transform: scale(0.98);
    }

    .footer {
      font-size: 11px;
      color: #666666;
      text-align: center;
      margin-top: 15px;
      border-top: 1px solid rgba(0, 255, 136, 0.2);
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">D</div>
      <h1>Deede</h1>
    </div>

    <div class="status">
      <div class="status-label">Status</div>
      <div class="status-value">Ready to analyze content</div>
    </div>

    <button id="analyzeBtn">ANALYZE CURRENT PAGE</button>
    <button id="settingsBtn">SETTINGS</button>

    <div class="footer">
      <p>Deepfake Detection v1.0</p>
      <p>Powered by Advanced AI</p>
    </div>
  </div>

  <script>
    document.getElementById('analyzeBtn').addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'analyzeContent' });
        }
      });
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
      alert('Settings page coming in v2');
    });
  </script>
</body>
</html>
`;
}

export function generateBackgroundJs(): string {
  return `
chrome.runtime.onInstalled.addListener(() => {
  console.log('Deede Deepfake Detector installed');
  chrome.storage.local.set({ isActive: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeContent') {
    console.log('Analyzing content from:', sender.url);
    sendResponse({ success: true, message: 'Analysis request received' });
  }
});
`;
}
