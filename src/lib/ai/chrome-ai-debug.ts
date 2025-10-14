/**
 * Chrome AI Debug Utilities
 *
 * Helper functions to diagnose Chrome AI setup issues.
 */

export interface ChromeAIDebugInfo {
  hasWindowAI: boolean;
  hasLanguageModel: boolean;
  canCreateTextSession: boolean;
  availability: string | null;
  capabilities: any;
  originTrialToken: string | null;
  userAgent: string;
  errors: string[];
}

/**
 * Check Chrome AI availability and setup
 *
 * Comprehensive diagnostic information for troubleshooting.
 */
export async function debugChromeAI(): Promise<ChromeAIDebugInfo> {
  const info: ChromeAIDebugInfo = {
    hasWindowAI: false,
    hasLanguageModel: false,
    canCreateTextSession: false,
    availability: null,
    capabilities: null,
    originTrialToken: null,
    userAgent: navigator.userAgent,
    errors: [],
  };

  // Check for Origin Trial token
  const tokenMeta = document.querySelector('meta[http-equiv="origin-trial"]');
  info.originTrialToken = tokenMeta?.getAttribute('content') || null;

  // Check multiple possible API locations
  const possibleLocations = [
    { path: 'window.ai', value: (window as any).ai },
    { path: 'window.chrome?.ai', value: (window as any).chrome?.ai },
    { path: 'navigator.ai', value: (navigator as any).ai },
    { path: 'self.ai', value: (self as any).ai },
  ];

  console.log('🔍 Checking all possible API locations:');
  possibleLocations.forEach(({ path, value }) => {
    console.log(`  ${path}:`, value !== undefined ? '✅ Found' : '❌ Not found');
    if (value !== undefined) {
      console.log('    Type:', typeof value);
      console.log('    Keys:', Object.keys(value || {}).slice(0, 10));
    }
  });

  // Check if window.ai exists
  if (typeof window !== 'undefined' && 'ai' in window) {
    info.hasWindowAI = true;

    try {
      // Check for languageModel API (newer API)
      if (window.ai && 'languageModel' in window.ai) {
        info.hasLanguageModel = true;

        // Check capabilities
        try {
          info.capabilities = await window.ai.languageModel.capabilities();
        } catch (error) {
          info.errors.push(`capabilities() error: ${error}`);
        }

        // Check availability
        try {
          const available = await window.ai.languageModel.capabilities();
          info.availability = available?.available || 'unknown';
        } catch (error) {
          info.errors.push(`availability check error: ${error}`);
        }
      }

      // Check for legacy canCreateTextSession API
      if (window.ai && 'canCreateTextSession' in window.ai) {
        info.canCreateTextSession = true;

        try {
          info.availability = await window.ai.canCreateTextSession();
        } catch (error) {
          info.errors.push(`canCreateTextSession() error: ${error}`);
        }
      }
    } catch (error) {
      info.errors.push(`General error: ${error}`);
    }
  } else {
    info.errors.push('window.ai is not defined');
  }

  return info;
}

/**
 * Print debug information to console
 */
export async function printChromeAIDebug(): Promise<void> {
  console.group('🔍 Chrome AI Debug Information');

  const info = await debugChromeAI();

  console.log('📋 Environment:');
  console.log('  User Agent:', info.userAgent);
  console.log('  Origin Trial Token:', info.originTrialToken ? '✅ Present' : '❌ Missing');

  console.log('\n🤖 Chrome AI API:');
  console.log('  window.ai:', info.hasWindowAI ? '✅ Available' : '❌ Not found');
  console.log('  languageModel:', info.hasLanguageModel ? '✅ Available' : '❌ Not found');
  console.log('  canCreateTextSession:', info.canCreateTextSession ? '✅ Available' : '❌ Not found');

  if (info.availability) {
    console.log('\n📊 Availability:', info.availability);
  }

  if (info.capabilities) {
    console.log('\n⚙️ Capabilities:', info.capabilities);
  }

  if (info.errors.length > 0) {
    console.log('\n⚠️ Errors:');
    info.errors.forEach(err => console.log('  -', err));
  }

  console.log('\n💡 Setup Instructions:');
  if (!info.hasWindowAI) {
    console.log('  Chrome version:', /Chrome\/(\d+)/.exec(info.userAgent)?.[1] || 'unknown');
    console.log('');
    console.log('  ⚠️ window.ai is not available. Possible reasons:');
    console.log('');
    console.log('  1️⃣ Flags not properly enabled:');
    console.log('     → Open chrome://flags/#optimization-guide-on-device-model');
    console.log('     → Set to "Enabled BypassPerfRequirement"');
    console.log('     → Open chrome://flags/#prompt-api-for-gemini-nano');
    console.log('     → Set to "Enabled"');
    console.log('     → Restart Chrome completely (close all windows)');
    console.log('');
    console.log('  2️⃣ Component not downloaded yet:');
    console.log('     → Open chrome://components/');
    console.log('     → Find "Optimization Guide On Device Model"');
    console.log('     → Click "Check for update"');
    console.log('     → Wait for download to complete (may take several minutes)');
    console.log('     → Restart Chrome');
    console.log('');
    console.log('  3️⃣ Chrome version issue:');
    console.log('     → You\'re on Chrome 141 (very new!)');
    console.log('     → The API might be in transition');
    console.log('     → Try Chrome Canary or Chrome Dev (v127+)');
    console.log('     → Download from: https://www.google.com/chrome/canary/');
    console.log('');
    console.log('  4️⃣ After all steps, run in console:');
    console.log('     → await debugChromeAI()');
  } else if (info.availability === 'after-download') {
    console.log('  1. Model needs to be downloaded');
    console.log('  2. Run: await window.ai.languageModel.create()');
    console.log('  3. Wait for download to complete (~1.7GB)');
  } else if (info.availability === 'no') {
    console.log('  ⚠️ Chrome AI is not available on this device');
    console.log('  Your device may not support on-device AI');
  } else if (info.availability === 'readily') {
    console.log('  ✅ Chrome AI is ready to use!');
  }

  console.groupEnd();

  return info as any;
}

/**
 * Attempt to download Chrome AI model
 */
export async function downloadChromeAIModel(): Promise<void> {
  if (!window.ai) {
    throw new Error('window.ai is not available. Enable Chrome flags first.');
  }

  if ('languageModel' in window.ai) {
    console.log('🔽 Starting Chrome AI model download...');
    console.log('This may take several minutes (~1.7GB download)');

    try {
      await window.ai.languageModel.create();
      console.log('✅ Model download complete!');
    } catch (error) {
      console.error('❌ Model download failed:', error);
      throw error;
    }
  } else {
    throw new Error('languageModel API not available');
  }
}

// Auto-run debug on load in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Add to window for easy console access
  (window as any).debugChromeAI = printChromeAIDebug;
  (window as any).downloadChromeAIModel = downloadChromeAIModel;

  // Auto-print on load
  setTimeout(() => {
    printChromeAIDebug().catch(console.error);
  }, 1000);
}
