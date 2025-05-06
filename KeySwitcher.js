// @ts-nocheck
import * as script from "../../../../../script.js";
import * as secrets from "../../../../../scripts/secrets.js";
import * as oai from "../../../../../scripts/openai.js";
import * as popup from "../../../../../scripts/popup.js";
import { SECRET_KEYS } from "../../../../../scripts/secrets.js";

// --- Webpack Wrapper (Keep if present in original, otherwise ignore) ---
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) { /* ... */ }
var __webpack_modules__ = {};
__webpack_modules__.d = (exports, definition) => { /* ... */ };
__webpack_modules__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
const exports = {};
__webpack_modules__.d(exports, { default: () => init });
// --- End Webpack Wrapper ---


// Import functions
const scriptFunctions = {
    eventSource: script.eventSource,
    event_types: script.event_types,
    getRequestHeaders: script.getRequestHeaders,
    saveSettingsDebounced: script.saveSettingsDebounced
};
const secretsFunctions = {
    updateSecretDisplay: secrets.updateSecretDisplay,
    writeSecret: secrets.writeSecret,
    findSecret: secrets.findSecret
};
const oaiFunctions = {
    oai_settings: oai.oai_settings
};
const popupFunctions = {
    POPUP_TYPE: popup.POPUP_TYPE,
    callGenericPopup: popup.callGenericPopup
};

// Helper function to create the name for the secret storing set data
function getProviderDataSecretKey(baseSecretKey) {
    return `${baseSecretKey}_key_sets_data`;
}

// Provider sources and keys - MODIFIED for Set Data
const PROVIDERS = {
    OPENROUTER: {
        name: "OpenRouter",
        source_check: () => ["openrouter"].includes(oaiFunctions.oai_settings.chat_completion_source),
        secret_key: SECRET_KEYS.OPENROUTER,
        data_secret_key: getProviderDataSecretKey(SECRET_KEYS.OPENROUTER), // Using new data key
        form_id: "openrouter_form",
        input_id: "api_key_openrouter",
        get_form: () => document.getElementById("openrouter_form"),
    },
    ANTHROPIC: {
        name: "Anthropic (Claude)",
        source_check: () => oaiFunctions.oai_settings.chat_completion_source === 'claude',
        secret_key: SECRET_KEYS.CLAUDE,
        data_secret_key: getProviderDataSecretKey(SECRET_KEYS.CLAUDE), // Using new data key
        form_id: "claude_form",
        input_id: "api_key_claude",
        get_form: () => document.getElementById("claude_form"),
    },
    OPENAI: {
        name: "OpenAI",
        source_check: () => oaiFunctions.oai_settings.chat_completion_source === 'openai',
        secret_key: SECRET_KEYS.OPENAI,
        data_secret_key: getProviderDataSecretKey(SECRET_KEYS.OPENAI), // Using new data key
        form_id: "openai_form",
        input_id: "api_key_openai",
        get_form: () => document.getElementById("openai_form"),
    },
    GEMINI: {
        name: "Google AI Studio (Gemini)",
        source_check: () => oaiFunctions.oai_settings.chat_completion_source === 'google',
        secret_key: SECRET_KEYS.MAKERSUITE,
        data_secret_key: getProviderDataSecretKey(SECRET_KEYS.MAKERSUITE), // Using new data key
        form_id: "makersuite_form",
        input_id: "api_key_makersuite",
        get_form: () => document.getElementById("makersuite_form"),
    },
    DEEPSEEK: {
        name: "DeepSeek",
        source_check: () => oaiFunctions.oai_settings.chat_completion_source === 'deepseek',
        secret_key: SECRET_KEYS.DEEPSEEK,
        data_secret_key: getProviderDataSecretKey(SECRET_KEYS.DEEPSEEK), // Using new data key
        form_id: "deepseek_form",
        input_id: "api_key_deepseek",
        get_form: () => document.getElementById("deepseek_form"),
    },
    XAI: {
        name: "Xai (Grok)",
        source_check: () => oaiFunctions.oai_settings.chat_completion_source === 'xai',
        secret_key: SECRET_KEYS.XAI,
        data_secret_key: getProviderDataSecretKey(SECRET_KEYS.XAI), // Using new data key
        form_id: "xai_form",
        input_id: "api_key_xai",
        get_form: () => document.getElementById("xai_form"),
    }
};

// Provider-specific error details
const PROVIDER_ERROR_MAPPINGS = {
    [SECRET_KEYS.CLAUDE]: {
        name: "Anthropic (Claude)",
        codes: {
            400: "Invalid Request: Check the format or content of your request.",
            401: "Authentication Error: Check your API key.",
            403: "Permission Error: Your API key lacks permission for this resource.",
            404: "Not Found: The requested resource was not found.",
            413: "Request Too Large: Request exceeds the maximum size.",
            429: "Rate Limit Error: Your account has hit a rate limit.",
            500: "API Error: An unexpected internal error occurred."
        }
    },
    [SECRET_KEYS.OPENAI]: {
        name: "OpenAI",
        codes: {
            401: "Authentication Error: Invalid API key or organization.",
            403: "Permission Denied: Country, region, or territory not supported, or other permission issue.",
            429: "Rate Limit/Quota Exceeded: Too many requests or ran out of credits.",
            500: "Server Error: Issue on OpenAI's servers.",
            503: "Service Unavailable: Engine overloaded or high traffic."
        }
    },
    [SECRET_KEYS.MAKERSUITE]: {
        name: "Google AI Studio (Gemini)",
        codes: {
            400: "Invalid Argument/Failed Precondition: Malformed request or billing/region issue for free tier.",
            403: "Permission Denied: API key lacks permissions or issue with tuned model auth.",
            404: "Not Found: Requested resource (e.g., file) wasn't found.",
            429: "Resource Exhausted: Rate limit exceeded.",
            500: "Internal Error: Unexpected error on Google's side (e.g., context too long).",
            503: "Service Unavailable: Service temporarily overloaded or down.",
            504: "Deadline Exceeded: Request took too long (e.g., context too large)."
        }
    },
    [SECRET_KEYS.DEEPSEEK]: {
        name: "DeepSeek",
        codes: {
            401: "Unauthorized: Check your API key and authentication headers.",
            429: "Too Many Requests: Reduce request rate or upgrade plan.",
            500: "Server Error: Retry the request after a short delay.",
            503: "Service Unavailable: Check status page."
        }
    },
    [SECRET_KEYS.XAI]: {
        name: "Xai (Grok)",
        codes: {
            400: "Bad Request: Invalid argument or incorrect API key supplied.",
            401: "Unauthorized: Missing or invalid authorization token.",
            403: "Forbidden: API key lacks permission or is blocked.",
            404: "Not Found: Model not found or invalid endpoint URL.",
            405: "Method Not Allowed: Incorrect HTTP method used.",
            415: "Unsupported Media Type: Empty request body or missing Content-Type header.",
            422: "Unprocessable Entity: Invalid format for a field in the request body.",
            429: "Too Many Requests: Rate limit reached."
        }
    },
     // Add mappings for OpenRouter if needed, might have generic or passthrough codes
    [SECRET_KEYS.OPENROUTER]: {
        name: "OpenRouter",
        codes: {
            // OpenRouter often passes through original errors, but might have its own specific ones
            401: "Authentication Error: Invalid OpenRouter API key.",
            402: "Payment Required: Account requires funds or payment method.", // Common for OpenRouter
            429: "Rate Limit/Quota Exceeded: Too many requests or insufficient credits/budget.",
            // Add other known common OpenRouter or passthrough codes here
        }
    }
};

// --- START: Error Code Preference Helpers ---
function getErrorCodePrefsKey(provider) {
    // Generates a unique key for storing this provider's error preferences in localStorage
    return `keyswitcher_error_prefs_${provider.secret_key}`;
}

function loadErrorCodePrefs(provider) {
    const prefsKey = getErrorCodePrefsKey(provider);
    const storedPrefs = localStorage.getItem(prefsKey);
    let prefs = {}; // Initialize as an empty object

    // Try to parse stored preferences if they exist
    if (storedPrefs) {
        try {
            prefs = JSON.parse(storedPrefs);
            // Basic validation: ensure it's a non-null object
            if (typeof prefs !== 'object' || prefs === null) {
                console.warn(`KeySwitcher: Invalid error code prefs format found for ${provider.name}. Resetting to defaults.`);
                prefs = {}; // Reset if format is wrong
            }
        } catch (e) {
            console.error(`KeySwitcher: Failed to parse error code prefs for ${provider.name}. Resetting. Error:`, e);
            prefs = {}; // Reset on parsing error
        }
    }

    // Ensure all known error codes for this provider have a default ('none') if not already set
    const providerCodes = PROVIDER_ERROR_MAPPINGS[provider.secret_key]?.codes || {};
    for (const code in providerCodes) {
        if (!(code in prefs) || !['rotate', 'remove', 'none'].includes(prefs[code])) {
             // If the code is missing or has an invalid value, set default to 'none'
            prefs[code] = 'none';
        }
    }
    // console.log(`KeySwitcher: Loaded error prefs for ${provider.name}:`, prefs); // Optional: for debugging
    return prefs;
}

function saveErrorCodePrefs(provider, prefs) {
    const prefsKey = getErrorCodePrefsKey(provider);
    try {
        localStorage.setItem(prefsKey, JSON.stringify(prefs));
        // console.log(`KeySwitcher: Saved error prefs for ${provider.name}:`, prefs); // Optional: for debugging
    } catch (e) {
        console.error(`KeySwitcher: Failed to save error code prefs for ${provider.name}. Error:`, e);
        // Optionally notify the user?
        toastr.error(`Failed to save error code preferences for ${provider.name}. Changes might not persist.`, "Save Error");
    }
}

/**
 * Gets the configured action ('rotate', 'remove', or 'none') for a given status code and provider.
 * Reads the preferences stored via loadErrorCodePrefs.
 * @param {object} provider The provider object from PROVIDERS.
 * @param {number | string} statusCode The HTTP status code.
 * @returns {'rotate'|'remove'|'none'} The configured action. Defaults to 'none'.
 */
function getErrorCodeAction(provider, statusCode) {
    // Return 'none' immediately if no status code is provided
    if (statusCode === null || statusCode === undefined) {
         return 'none';
    }
    // Load the currently saved preferences for this provider
    const prefs = loadErrorCodePrefs(provider);
    // Preferences are keyed by the string representation of the status code
    const action = prefs[String(statusCode)];

    // Validate the retrieved action; default to 'none' if it's not valid or not found
    return ['rotate', 'remove'].includes(action) ? action : 'none';
}
// --- END: Error Code Preference Helpers ---

// Removal Triggers
const REMOVAL_STATUS_CODES = [400, 401, 402, 403, 404, 429]; // Added 402 for potential payment issues
const REMOVAL_MESSAGE_REGEX = /Unauthorized|Forbidden|Permission|Invalid|Exceeded|Internal|budget|payment/i; // Added budget/payment

// Check if current source matches a provider
const isProviderSource = (provider) => provider.source_check();

// Key switching state - Per provider
let keySwitchingEnabled = {};
let showErrorDetails = {};

// Initialize states from localStorage
Object.values(PROVIDERS).forEach(provider => {
    keySwitchingEnabled[provider.secret_key] = localStorage.getItem(`switch_key_${provider.secret_key}`) === "true";
    showErrorDetails[provider.secret_key] = localStorage.getItem(`show_${provider.secret_key}_error`) !== "false";
});

// Show error information popup (Enhanced from original, kept as is for now)
function showErrorPopup(provider, errorMessage, errorTitle = "API Error", wasKeyRemoved = false, removedKey = null) {
    let popupContent = `<h3>${errorTitle}</h3>`;
    let statusCode = null;
    let detailedError = null;
    const statusCodeMatch = errorMessage.match(/\b(\d{3})\b/);
    if (statusCodeMatch) statusCode = parseInt(statusCodeMatch[1], 10);
    try {
        const jsonMatch = errorMessage.match(/({.*})/);
        if (jsonMatch && jsonMatch[1]) detailedError = JSON.parse(jsonMatch[1]).error;
    } catch (e) { console.warn("Could not parse detailed error from message:", e); }
    const providerMapping = PROVIDER_ERROR_MAPPINGS[provider?.secret_key];
    if (providerMapping) popupContent += `<h4>Provider: ${providerMapping.name}</h4>`;
    const currentKeyElement = document.getElementById(`current_key_${provider?.secret_key}`); // Use getElementById
    if (currentKeyElement) popupContent += `<p><b>${currentKeyElement.textContent}</b></p>`;
    if (statusCode) {
        popupContent += `<p><b>Status Code:</b> ${statusCode}</p>`;
        if (providerMapping && providerMapping.codes[statusCode]) popupContent += `<p><b>Possible Reason:</b> ${providerMapping.codes[statusCode]}</p>`;
    }
    if (detailedError) {
        popupContent += `<p><b>API Message:</b> ${detailedError.message || 'N/A'}</p>`;
        if (detailedError.type) popupContent += `<p><b>Type:</b> ${detailedError.type}</p>`;
        if (detailedError.code) popupContent += `<p><b>Code:</b> ${detailedError.code}</p>`;
    }
    if (wasKeyRemoved && removedKey) popupContent += `<p style='color: red; font-weight: bold; margin-top: 10px;'>The failing API key (${removedKey}) has been automatically removed from the active set's internal list. Please try generating again.</p>`; // Updated text
    popupContent += `<hr><p><b>Raw Error Message:</b></p><pre style="white-space: pre-wrap; word-wrap: break-word;">${errorMessage}</pre>`;
    popupFunctions.callGenericPopup(popupContent, popupFunctions.POPUP_TYPE.TEXT, "", { large: true, wide: true, allowVerticalScrolling: true });
}

// Initialize the plugin
async function init(loadedSecrets) {
    console.log("MultiProviderKeySwitcher init function called.");
}

// Create a button element - CORRECTED (removed async)
function createButton(title, onClick) {
    const button = document.createElement("div");
    button.classList.add("menu_button", "menu_button_icon", "interactable");
    button.title = title;
    button.onclick = onClick; // The handler CAN be async

    const span = document.createElement("span");
    span.textContent = title;
    button.appendChild(span);

    return button; // Return the DOM Node directly
}

// --- Helper Functions for Set Data ---

// Defines the default structure for a provider's key set data
function getDefaultSetData() {
    return {
        activeSetIndex: 0,
        sets: [{ name: "Default", keys: "" }]
    };
}

// Loads and parses the key set data from secrets
function loadSetData(provider, loadedSecrets) {
    const dataKey = provider.data_secret_key;
    const jsonData = loadedSecrets[dataKey];
    let data;
    if (jsonData) {
        try {
            data = JSON.parse(jsonData);
            if (!data || typeof data.activeSetIndex !== 'number' || !Array.isArray(data.sets)) {
                console.warn(`KeySwitcher: Invalid data structure found for ${provider.name}. Resetting to default.`);
                data = getDefaultSetData();
            }
             if (data.sets.length === 0) {
                 data.sets.push({ name: "Default", keys: "" });
                 data.activeSetIndex = 0;
             }
             if (data.activeSetIndex < 0 || data.activeSetIndex >= data.sets.length) {
                 console.warn(`KeySwitcher: Invalid activeSetIndex (${data.activeSetIndex}) for ${provider.name}. Resetting to 0.`);
                 data.activeSetIndex = 0;
             }
        } catch (error) {
            console.error(`KeySwitcher: Failed to parse key set data for ${provider.name}. Resetting to default. Error:`, error);
            data = getDefaultSetData();
        }
    } else {
        data = getDefaultSetData();
    }
    data.sets = data.sets.map(set => ({
        name: set?.name ?? "Unnamed Set",
        keys: set?.keys ?? ""
    }));
    return data;
}

// Saves the key set data back to secrets
async function saveSetData(provider, data) {
    const dataKey = provider.data_secret_key;
    const jsonData = JSON.stringify(data);
    await secretsFunctions.writeSecret(dataKey, jsonData);
}

// Helper to split keys consistently
function splitKeys(keysString) {
    if (!keysString) return [];
    return keysString.split(/[\n;]/).map(k => k.trim()).filter(k => k.length > 0);
}

// --- End Helper Functions for Set Data ---

// Handle key rotation for the ACTIVE SET of a specific provider
async function handleKeyRotation(providerKey) {
    // Find the provider config using the main secret key
    const provider = Object.values(PROVIDERS).find(p => p.secret_key === providerKey);
    if (!provider) {
        console.error(`KeySwitcher: handleKeyRotation called with unknown providerKey: ${providerKey}`);
        return;
    }

    // Load the current set data for this provider
    const loadedSecrets = await getSecrets();
    if (!loadedSecrets) {
        console.error(`KeySwitcher: Failed to get secrets during rotation for ${provider.name}`);
        return; // Cannot proceed without secrets
    }
    const data = loadSetData(provider, loadedSecrets);

    // Check if switching is enabled (might be redundant if called only when enabled, but good safety check)
    if (!keySwitchingEnabled[provider.secret_key]) {
        console.log(`KeySwitcher: Rotation skipped for ${provider.name}, switching is disabled.`);
        return;
    }

    // Get the active set based on the index in data
    const activeSetIndex = data.activeSetIndex;
    const activeSet = data.sets[activeSetIndex];

    if (!activeSet) {
        console.error(`KeySwitcher: Active set index ${activeSetIndex} invalid for ${provider.name}. Cannot rotate.`);
        return;
    }

    // Get the keys from the active set string
    const keysInActiveSet = splitKeys(activeSet.keys);

    // If 1 or fewer keys in the active set, no rotation is possible/needed
    if (keysInActiveSet.length <= 1) {
        console.log(`KeySwitcher: Rotation skipped for ${provider.name} (Set: ${activeSet.name}). Not enough keys (${keysInActiveSet.length}).`);
        // Ensure the current key is set correctly if there's exactly one key
        if (keysInActiveSet.length === 1) {
             const currentActiveKey = await secretsFunctions.findSecret(provider.secret_key);
             if (currentActiveKey !== keysInActiveSet[0]) {
                 console.log(`KeySwitcher: Setting the single available key for ${provider.name} (Set: ${activeSet.name}) as active.`);
                 await secretsFunctions.writeSecret(provider.secret_key, keysInActiveSet[0]);
                 secrets.secret_state[provider.secret_key] = true; // Update global state
                 secretsFunctions.updateSecretDisplay();
             }
        } else { // Zero keys
            const currentActiveKey = await secretsFunctions.findSecret(provider.secret_key);
            if (currentActiveKey) { // If a key is set but the set is empty, clear it
                console.log(`KeySwitcher: Active set '${activeSet.name}' for ${provider.name} is empty. Clearing active key.`);
                await secretsFunctions.writeSecret(provider.secret_key, "");
                secrets.secret_state[provider.secret_key] = false;
                 secretsFunctions.updateSecretDisplay();
            }
        }
        // Update the info panel regardless, to show current state
        await updateProviderInfoPanel(provider, data);
        return;
    }

    // Find the currently active key in SillyTavern's main secret store
    const currentKey = await secretsFunctions.findSecret(provider.secret_key) || "";
    let newKey = "";

    // Find the index of the current key within the active set's keys
    const currentKeyIndexInSet = keysInActiveSet.indexOf(currentKey);

    if (currentKeyIndexInSet !== -1) {
        // Current key IS in the active set list. Rotate to the next one.
        const nextKeyIndex = (currentKeyIndexInSet + 1) % keysInActiveSet.length; // Wrap around using modulo
        newKey = keysInActiveSet[nextKeyIndex];
    } else {
        // Current key is NOT in the active set list (or it's empty).
        // This could happen if the set was edited, or the key was removed manually, or it's the first load.
        // Default to the first key in the active set.
        console.log(`KeySwitcher: Current key '${currentKey}' not found in active set '${activeSet.name}' for ${provider.name}. Using first key.`);
        newKey = keysInActiveSet[0];
    }

    // Only write the secret and update if the new key is different from the current one
    if (newKey && newKey !== currentKey) {
        console.log(`KeySwitcher: Rotating key for ${provider.name} (Set: ${activeSet.name}). From: '${currentKey || "N/A"}' To: '${newKey}'`);
        await secretsFunctions.writeSecret(provider.secret_key, newKey);

        // Update global secret state and display (like placeholders)
        secrets.secret_state[provider.secret_key] = !!newKey;
        secretsFunctions.updateSecretDisplay();

        // Update our info panel display to show the newly rotated key
        // (We need the latest data, although only the active key actually changed server-side)
        await updateProviderInfoPanel(provider, data);

        // Optionally: Update the main key input field value if visible (helps user see change)
        const mainInput = document.getElementById(provider.input_id);
        if (mainInput) {
            mainInput.value = newKey;
        }
    } else {
         console.log(`KeySwitcher: Rotation check for ${provider.name} (Set: ${activeSet.name}). No change needed. Current key: '${currentKey || "N/A"}'`);
         // Still update panel in case initial load needed it
         await updateProviderInfoPanel(provider, data);
    }
}

/**
 * Handles the removal of a specific key from the currently active set for a provider.
 * Typically called when an API error indicates the key is invalid.
 *
 * @param {object} provider The provider object from PROVIDERS.
 * @param {string} failedKey The API key that failed and should be removed.
 * @returns {Promise<string|null>} The new key activated after removal, or null if no key was removed/no other keys are available.
 */
// --- Recycle Bin Utilities ---
function getRecycleBinKey(provider) {
    return `keyswitcher_recycle_bin_${provider.secret_key}`;
}
function loadRecycleBin(provider) {
    try {
        return JSON.parse(localStorage.getItem(getRecycleBinKey(provider))) || [];
    } catch { return []; }
}
function saveRecycleBin(provider, bin) {
    localStorage.setItem(getRecycleBinKey(provider), JSON.stringify(bin));
}

async function handleKeyRemoval(provider, failedKey, reason = "Unknown") {
    console.log(`KeySwitcher: Attempting removal of key '${failedKey}' for ${provider.name}.`);

    // Load the current set data
    const loadedSecrets = await getSecrets();
    if (!loadedSecrets) {
        console.error(`KeySwitcher: Failed to get secrets during key removal for ${provider.name}. Aborting removal.`);
        return null;
    }
    let data = loadSetData(provider, loadedSecrets); // Use 'let' as we might modify it

    // Find the active set
    const activeSetIndex = data.activeSetIndex;
    const activeSet = data.sets[activeSetIndex];

    if (!activeSet) {
        console.error(`KeySwitcher: Active set index ${activeSetIndex} invalid for ${provider.name}. Cannot remove key.`);
        return null;
    }

    // Get the keys from the active set string and find the index of the failed key
    let keysInActiveSet = splitKeys(activeSet.keys);
    const failedKeyIndex = keysInActiveSet.indexOf(failedKey);

    // If the failed key wasn't found in the active set's list
    if (failedKeyIndex === -1) {
        console.warn(`KeySwitcher: Failed key '${failedKey}' not found in the list of keys for active set '${activeSet.name}' (${provider.name}). Key not removed from storage.`);
        // Optional: Attempt a regular rotation as a fallback, hoping to find a working key?
        // console.log(`KeySwitcher: Performing standard rotation instead.`);
        // await handleKeyRotation(provider.secret_key); // Call the other refactored function
        return null; // Return null because the *specific requested removal* didn't happen
    }

    // --- Key WAS found - Proceed with removal ---
    console.log(`KeySwitcher: Found key '${failedKey}' at index ${failedKeyIndex} in active set '${activeSet.name}'. Removing...`);

    // --- Add to recycle bin ---
    const recycleBin = loadRecycleBin(provider);
    recycleBin.push({
        key: failedKey,
        set: activeSet.name,
        reason,
        removedAt: new Date().toISOString()
    });
    saveRecycleBin(provider, recycleBin);

    // Remove the key from the array
    keysInActiveSet.splice(failedKeyIndex, 1); // Remove 1 element at failedKeyIndex

    // Update the keys string in the data object
    data.sets[activeSetIndex].keys = keysInActiveSet.join('\n'); // Re-join remaining keys with newline

    // --- Save the updated data structure back to secrets ---
    try {
        await saveSetData(provider, data);
        console.log(`KeySwitcher: Successfully saved updated key list for set '${activeSet.name}' after removing '${failedKey}'.`);
    } catch (error) {
        console.error(`KeySwitcher: Failed to save updated set data for ${provider.name} after key removal. Error:`, error);
        // Decide if we should still proceed with activating a new key or abort
        return null; // Abort if saving failed
    }

    // --- Determine the next key to activate ---
    let newKeyToActivate = null;
    if (keysInActiveSet.length > 0) {
        // If there are keys remaining, activate the one at the same index
        // where the failed key WAS (which is now the next key), wrapping around.
        const nextKeyIndex = failedKeyIndex % keysInActiveSet.length; // Modulo handles wrap-around and index shift after splice
        newKeyToActivate = keysInActiveSet[nextKeyIndex];
        console.log(`KeySwitcher: Activating next key at index ${nextKeyIndex}: '${newKeyToActivate}'`);
    } else {
        // The set is now empty after removing the last key
        newKeyToActivate = ""; // Use empty string to clear the active key
        console.log(`KeySwitcher: Active set '${activeSet.name}' is now empty after removing the last key.`);
    }

    // --- Activate the new key (or clear it) in SillyTavern's main secret ---
    const currentActiveKey = await secretsFunctions.findSecret(provider.secret_key);
    if (currentActiveKey !== newKeyToActivate) {
         await secretsFunctions.writeSecret(provider.secret_key, newKeyToActivate);
         secrets.secret_state[provider.secret_key] = !!newKeyToActivate; // Update global state based on new key
         secretsFunctions.updateSecretDisplay();
         console.log(`KeySwitcher: Updated active key for ${provider.name} to '${newKeyToActivate || "N/A"}'.`);

         // Optionally update the main input field
         const mainInput = document.getElementById(provider.input_id);
         if (mainInput) mainInput.value = newKeyToActivate;

    } else {
        console.log(`KeySwitcher: The key to activate (${newKeyToActivate || "N/A"}) is already the active key. No change needed to main secret.`);
        // Ensure UI reflects potential empty state if key removed was the only one
        secrets.secret_state[provider.secret_key] = !!newKeyToActivate;
        secretsFunctions.updateSecretDisplay();
    }


    // Update our info panel display to reflect the changes
    await updateProviderInfoPanel(provider, data);
    // Also update the dynamic UI (recycle bin, sets, etc) immediately
    await redrawProviderUI(provider, data);

    // Return the key that was activated
    return newKeyToActivate;
}


// Get secrets from the server
async function getSecrets() {
    try {
        const response = await fetch("/api/secrets/view", {
            method: "POST",
            headers: scriptFunctions.getRequestHeaders(),
        });
        if (!response.ok) {
            console.error(`KeySwitcher: Failed to fetch secrets, status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("KeySwitcher: Error fetching secrets:", error);
        return null;
    }
}

// --- Info Panel Update Function ---
async function updateProviderInfoPanel(provider, data) {
    const getText = (selectorId) => {
        const element = document.getElementById(selectorId);
        return element ? element.textContent : 'Element not found!';
    };
    const activeSetDiv = document.getElementById(`active_set_info_${provider.secret_key}`);
    if (activeSetDiv) {
        const activeSetName = data.sets[data.activeSetIndex]?.name || "Unknown Set";
        activeSetDiv.textContent = `Active Set: ${activeSetName} (Set #${data.activeSetIndex})`;
    } else console.warn(`KeySwitcher: Could not find activeSetDiv for ${provider.name}`);
    const currentKeyDiv = document.getElementById(`current_key_${provider.secret_key}`);
    if (currentKeyDiv) {
        const currentActiveKeyValue = await secretsFunctions.findSecret(provider.secret_key);
        currentKeyDiv.textContent = `Current Key: ${currentActiveKeyValue ? currentActiveKeyValue : 'N/A'}`; // Simplified N/A message
    } else console.warn(`KeySwitcher: Could not find currentKeyDiv for ${provider.name}`);
    const switchStatusDiv = document.getElementById(`switch_key_${provider.secret_key}`);
    if (switchStatusDiv) {
        switchStatusDiv.textContent = `Switching: ${keySwitchingEnabled[provider.secret_key] ? "On" : "Off"}`;
    } else console.warn(`KeySwitcher: Could not find switchStatusDiv for ${provider.name}`);
    const errorToggleDiv = document.getElementById(`show_${provider.secret_key}_error`);
    if (errorToggleDiv) {
        errorToggleDiv.textContent = `Error Details: ${showErrorDetails[provider.secret_key] ? "On" : "Off"}`;
    } else console.warn(`KeySwitcher: Could not find errorToggleDiv for ${provider.name}`);
}

/**
 * Redraws the dynamic UI section for managing key sets for a specific provider.
 * This includes the list of sets, textareas for keys, and management buttons.
 *
 * @param {object} provider The provider object from PROVIDERS.
 * @param {object} data The current structured data object for this provider (from loadSetData).
 */
async function redrawProviderUI(provider, data) {
    const dynamicContainerId = `keyswitcher-sets-dynamic-${provider.secret_key}`;
    const dynamicContainer = document.getElementById(dynamicContainerId);
    if (!dynamicContainer) {
        console.error(`KeySwitcher: Dynamic container not found for ${provider.name} (ID: ${dynamicContainerId})`);
        return;
    }

    // --- Clear existing UI ---
    dynamicContainer.innerHTML = '';

    // --- Recycle Bin UI ---
    // Remove previous recycle bin if any
    const oldBin = document.getElementById(`keyswitcher-recycle-bin-${provider.secret_key}`);
    if (oldBin) oldBin.remove();
    const recycleBinSection = document.createElement("div");
    recycleBinSection.id = `keyswitcher-recycle-bin-${provider.secret_key}`;
    recycleBinSection.style.marginBottom = "18px";
    recycleBinSection.style.padding = "8px";
    recycleBinSection.style.border = "1px dashed #b44";
    recycleBinSection.style.borderRadius = "4px";
    recycleBinSection.style.background = "#2a1818";

    const recycleHeader = document.createElement("div");
    recycleHeader.style.display = "flex";
    recycleHeader.style.justifyContent = "space-between";
    recycleHeader.style.alignItems = "center";
    recycleHeader.style.cursor = "pointer";
    recycleHeader.style.fontWeight = "bold";
    recycleHeader.textContent = "🗑️ Recycle Bin (Removed Keys)";
    recycleHeader.title = "Click to collapse/expand";
    recycleBinSection.appendChild(recycleHeader);

    // Collapsible logic
    // --- Collapsible state persistence ---
    const collapseKey = `keyswitcher-recycle-collapsed-${provider.secret_key}`;
    let recycleCollapsed = localStorage.getItem(collapseKey) !== 'false'; // default true (collapsed)
    const binContent = document.createElement("div");
    binContent.style.display = recycleCollapsed ? "none" : "block";
    recycleHeader.onclick = () => {
        recycleCollapsed = !recycleCollapsed;
        localStorage.setItem(collapseKey, recycleCollapsed);
        binContent.style.display = recycleCollapsed ? "none" : "block";
    };

    recycleBinSection.appendChild(binContent);

    // Load and render bin
    const recycleBin = loadRecycleBin(provider);
    if (recycleBin.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "Recycle bin is empty.";
        empty.style.fontStyle = "italic";
        binContent.appendChild(empty);
    } else {
        recycleBin.forEach((entry, idx) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.borderBottom = "1px solid #a44";
            row.style.padding = "5px 0";

            const keyRow = document.createElement("div");
            keyRow.textContent = entry.key;
            keyRow.style.wordBreak = "break-all";
            keyRow.style.fontSize = "0.95em";
            keyRow.style.background = "#1a1a1a";
            keyRow.style.color = "#e0c0c0";
            keyRow.style.padding = "2px 6px";
            keyRow.style.marginBottom = "2px";
            row.appendChild(keyRow);

            const meta = document.createElement("div");
            meta.style.fontSize = "0.85em";
            meta.style.color = "#b88";
            meta.textContent =
                `Set: ${entry.set} | Reason: ${entry.reason} | Removed: ${new Date(entry.removedAt).toLocaleString()}`;
            row.appendChild(meta);

            const btnRow = document.createElement("div");
            btnRow.style.display = "flex";
            btnRow.style.gap = "8px";
            btnRow.style.marginTop = "2px";
            const restoreBtn = createButton("Restore", async () => {
                // Restore to active set
                const loadedSecrets = await getSecrets();
                const d = loadSetData(provider, loadedSecrets);
                const setIdx = d.sets.findIndex(s => s.name === entry.set);
                if (setIdx !== -1) {
                    d.sets[setIdx].keys += (d.sets[setIdx].keys ? "\n" : "") + entry.key;
                    await saveSetData(provider, d);
                    // Remove from bin
                    const bin = loadRecycleBin(provider);
                    bin.splice(idx, 1);
                    saveRecycleBin(provider, bin);
                    // Persist collapse state and force open after redraw
                    localStorage.setItem(collapseKey, 'false');
                    await redrawProviderUI(provider, d);
                    await updateProviderInfoPanel(provider, d);
                } else {
                    alert("Original set not found. Key cannot be restored.");
                }
            });
            btnRow.appendChild(restoreBtn);
            const deleteBtn = createButton("Delete Permanently", () => {
                const bin = loadRecycleBin(provider);
                bin.splice(idx, 1);
                saveRecycleBin(provider, bin);
                // Persist collapse state and force open after redraw
                localStorage.setItem(collapseKey, 'false');
                redrawProviderUI(provider, data);
            });
            btnRow.appendChild(deleteBtn);
            row.appendChild(btnRow);

            binContent.appendChild(row);
        });
    }
    // Insert at top
    dynamicContainer.prepend(recycleBinSection);

    // --- Add Separator & Header for Sets Area ---
    const setsAreaHeader = document.createElement("h5");
    setsAreaHeader.textContent = "Key Sets:";
    setsAreaHeader.style.marginTop = "15px";
    setsAreaHeader.style.marginBottom = "5px";
    dynamicContainer.appendChild(document.createElement("hr")); // Separator above the sets
    dynamicContainer.appendChild(setsAreaHeader);

    // --- Iterate and Draw Each Set ---
    if (!data.sets || data.sets.length === 0) {
        const noSetsMessage = document.createElement('p');
        noSetsMessage.textContent = "No key sets defined. Click 'Add New Set' to create one.";
        noSetsMessage.style.fontStyle = "italic";
        dynamicContainer.appendChild(noSetsMessage);
    } else {
        data.sets.forEach((set, index) => {
            const setContainer = document.createElement("div");
            setContainer.classList.add("keyswitcher-set-item");
            setContainer.style.border = "1px solid #555";
            setContainer.style.borderRadius = "4px";
            setContainer.style.padding = "10px";
            setContainer.style.marginBottom = "10px";
            if (index === data.activeSetIndex) {
                setContainer.style.borderColor = "#8cff7a"; // Highlight active set
                setContainer.style.boxShadow = "0 0 5px #8cff7a";
            }

            // Set Header (Name & Buttons)
            const setHeader = document.createElement("div");
            setHeader.style.display = "flex";
            setHeader.style.justifyContent = "space-between";
            setHeader.style.alignItems = "center";
            setHeader.style.marginBottom = "8px";

            const setName = document.createElement("strong");
            setName.textContent = `${set.name} ${index === data.activeSetIndex ? '(Active)' : ''}`;
            // TODO: Add rename functionality here later by making setName editable

            const setButtons = document.createElement("div");
            setButtons.style.display = "flex";
            setButtons.style.gap = "5px";

            // Activate Button (only if not already active)
            if (index !== data.activeSetIndex) {
                const activateButton = createButton("Activate Set", async () => {
                    console.log(`KeySwitcher: Activating set ${index} ('${set.name}') for ${provider.name}`);
                    data.activeSetIndex = index;
                    await saveSetData(provider, data); // Save the new active index
                    await handleKeyRotation(provider.secret_key); // Trigger rotation to (potentially) set the first key of the new active set
                    // We need to reload data and redraw everything
                    const updatedSecrets = await getSecrets();
                    if (updatedSecrets) {
                        const updatedData = loadSetData(provider, updatedSecrets);
                        await updateProviderInfoPanel(provider, updatedData); // Update static panel
                        await redrawProviderUI(provider, updatedData);       // Redraw dynamic section
                    }
                });
                setButtons.appendChild(activateButton);
            }

            // Delete Button (disable if only one set exists)
            const deleteButton = createButton("Delete Set", async () => {
                if (confirm(`Are you sure you want to delete the key set "${set.name}"? This cannot be undone.`)) {
                    console.log(`KeySwitcher: Deleting set ${index} ('${set.name}') for ${provider.name}`);
                    data.sets.splice(index, 1); // Remove the set from the array

                    // Adjust activeSetIndex if needed
                    if (data.activeSetIndex === index) {
                        // If deleting the active set, default to the first set (index 0)
                        data.activeSetIndex = 0;
                        console.log("KeySwitcher: Deleted active set, setting set 0 as new active.");
                    } else if (data.activeSetIndex > index) {
                        // If deleting a set before the active one, shift the active index down
                        data.activeSetIndex--;
                         console.log("KeySwitcher: Deleted set before active set, adjusting active index.");
                    }

                    // Ensure at least one set remains (create default if necessary)
                    if (data.sets.length === 0) {
                         console.log("KeySwitcher: Last set deleted, creating a new default set.");
                        data.sets.push({ name: "Default", keys: "" });
                        data.activeSetIndex = 0;
                    }

                    await saveSetData(provider, data); // Save changes

                    // Reload and redraw UI completely
                    const updatedSecrets = await getSecrets();
                    if (updatedSecrets) {
                        const updatedData = loadSetData(provider, updatedSecrets);
                        // Trigger rotation for the (potentially new) active set
                        await handleKeyRotation(provider.secret_key);
                        await updateProviderInfoPanel(provider, updatedData);
                        await redrawProviderUI(provider, updatedData);
                    }
                }
            });
            if (data.sets.length <= 1) {
                deleteButton.disabled = true; // Cannot delete the last set
                deleteButton.title = "Cannot delete the only set.";
                deleteButton.style.opacity = "0.5";
                deleteButton.style.cursor = "not-allowed";
            }
            setButtons.appendChild(deleteButton);

            // TODO: Add Rename button later


            setHeader.appendChild(setName);
            setHeader.appendChild(setButtons);
            setContainer.appendChild(setHeader);

            // Keys Textarea
            const keysTextarea = document.createElement("textarea");
            keysTextarea.classList.add("text_pole", "api_key_textarea"); // Use similar styling
            keysTextarea.rows = 4; // Adjust as needed
            keysTextarea.placeholder = `Enter API keys for set "${set.name}", one per line or separated by semicolons.`;
            keysTextarea.value = set.keys || "";
            keysTextarea.style.width = "100%"; // Ensure it fills container
            keysTextarea.style.boxSizing = 'border-box'; // Include padding/border in width

            // Save keys on blur (when textarea loses focus)
            keysTextarea.addEventListener('blur', async (event) => {
                const newKeys = event.target.value.trim();
                if (set.keys !== newKeys) {
                    console.log(`KeySwitcher: Updating keys for set ${index} ('${set.name}') for ${provider.name}`);
                    set.keys = newKeys; // Update in the local data object first
                    data.sets[index].keys = newKeys; // Ensure parent data obj is updated too
                    await saveSetData(provider, data); // Save the whole data structure

                    // If these were keys for the *active* set, trigger rotation logic
                    // in case the currently active key was removed or changed.
                    if (index === data.activeSetIndex) {
                         console.log("KeySwitcher: Keys updated for the active set. Triggering rotation check.");
                        await handleKeyRotation(provider.secret_key); // This will update the info panel too
                    }
                }
            });

            setContainer.appendChild(keysTextarea);
            dynamicContainer.appendChild(setContainer);
        });
    }

    // --- Add "New Set" Button ---
    const addNewSetButton = createButton("Add New Set", async () => {
        const newSetName = prompt("Enter a name for the new key set:", `Set ${data.sets.length + 1}`);
        if (newSetName && newSetName.trim()) {
            console.log(`KeySwitcher: Adding new set named '${newSetName}' for ${provider.name}`);
            data.sets.push({ name: newSetName.trim(), keys: "" });
            await saveSetData(provider, data); // Save the new set
            // Reload and redraw UI
            const updatedSecrets = await getSecrets();
             if (updatedSecrets) {
                 const updatedData = loadSetData(provider, updatedSecrets);
                 await updateProviderInfoPanel(provider, updatedData); // Update just in case (though unlikely to change)
                 await redrawProviderUI(provider, updatedData);       // Redraw dynamic section
             }
        } else if (newSetName !== null) { // Check if prompt was cancelled vs empty input
            alert("Set name cannot be empty.");
        }
    });
    addNewSetButton.style.marginTop = "10px";
    dynamicContainer.appendChild(addNewSetButton);
}

// --- START: Error Code Actions UI (Minimal Placeholder) --- [ADDED IN THIS STEP]
const errorActionsSection = document.createElement("div");
errorActionsSection.id = `keyswitcher-error-actions-${provider.secret_key}`; // Unique ID
errorActionsSection.style.marginTop = "20px"; // Add space above
errorActionsSection.style.border = "1px dashed #888"; // Use dashed border for placeholder
errorActionsSection.style.borderRadius = "4px";
errorActionsSection.style.padding = "10px";
errorActionsSection.style.color = "#aaa"; // Dim text color

// Simple placeholder text
errorActionsSection.textContent = "[Error Code Actions UI will be added here]";

// Append this minimal placeholder to the main dynamic container
dynamicContainer.appendChild(errorActionsSection);
// --- END: Error Code Actions UI (Minimal Placeholder) ---

// --- Main Initialization Logic ---
jQuery(async () => {
    console.log("MultiProviderKeySwitcher: Initializing...");

    // Override toastr.error to intercept API errors and handle key switching/removal
    const originalToastrError = toastr.error;
    toastr.error = async function(...args) {
        originalToastrError(...args);
        console.log("KeySwitcher: Toastr Error Args:", args);
        console.error(...args);
        const [errorMessage, errorTitle] = args;
        for (const provider of Object.values(PROVIDERS)) {
            if (isProviderSource(provider)) {
                console.log(`KeySwitcher: Error occurred while ${provider.name} was active.`);
                let keyRemoved = false;
                let removedKeyValue = null;
                const failedKey = await secretsFunctions.findSecret(provider.secret_key);
                if (failedKey && keySwitchingEnabled[provider.secret_key]) {
                    const statusCodeMatch = errorMessage.match(/\b(\d{3})\b/);
                    let statusCode = null;
                    if (statusCodeMatch) statusCode = parseInt(statusCodeMatch[1], 10);
                    const isRemovalStatusCode = REMOVAL_STATUS_CODES.includes(statusCode);
                    const isRemovalMessage = REMOVAL_MESSAGE_REGEX.test(errorMessage);
                    if (isRemovalStatusCode || isRemovalMessage) {
                        console.log(`KeySwitcher: Removal trigger matched for ${provider.name}. Attempting removal...`);
                        // Extract a more meaningful removal reason from errorMessage
let removalReason = "Unknown";
try {
    // Try to extract the error message from JSON if present
    const jsonMatch = errorMessage.match(/({.*})/);
    if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed && parsed.error && parsed.error.message) {
            removalReason = parsed.error.message;
        }
    } else {
        // Fallback: use first line or a substring
        removalReason = errorMessage.split('\n')[0].slice(0, 120);
    }
} catch { removalReason = errorMessage.split('\n')[0].slice(0, 120); }
const newKey = await handleKeyRemoval(provider, failedKey, removalReason); // Pass reason
                        if (newKey !== null) {
                             keyRemoved = true;
                             removedKeyValue = failedKey;
                             console.log(`KeySwitcher: Key ${failedKey} supposedly removed, new key is ${newKey}`);
                        } else {
                            console.log(`KeySwitcher: handleKeyRemoval returned null (or failed), key ${failedKey} not removed.`);
                        }
                    } else {
                        console.log(`KeySwitcher: Error for ${provider.name} (Switching ON) did not match removal triggers. Rotating...`);
                        await handleKeyRotation(provider.secret_key);
                    }
                } else if (failedKey) {
                    console.log(`KeySwitcher: Error for ${provider.name} occurred, but Key Switching is OFF.`);
                } else {
                    console.log(`KeySwitcher: Error for ${provider.name} occurred, but no failed key found in secret.`);
                }
                if (showErrorDetails[provider.secret_key]) {
                     showErrorPopup(provider, errorMessage, errorTitle || `${provider.name} API Error`, keyRemoved, removedKeyValue);
                }
                 break;
            }
        }
    };

    // Get initial secrets
    const loadedSecrets = await getSecrets();
    if (!loadedSecrets) {
        console.error("KeySwitcher: Failed to load secrets on initial load. UI setup aborted.");
        toastr.error("KeySwitcher: Failed to load secrets. Key management UI disabled.", "Initialization Error");
        return;
    }
    await init(loadedSecrets);

    // Process each provider - Setup UI
    for (const provider of Object.values(PROVIDERS)) {
        console.log(`KeySwitcher: Processing provider UI for: ${provider.name}`);
        const formElement = provider.get_form();
        console.log(`KeySwitcher: >>> Result of get_form() for ${provider.name}:`, formElement);

        if (formElement) {
            // Check if UI already injected (simple check for our main container)
            if (formElement.querySelector(`#keyswitcher-main-${provider.secret_key}`)) {
                console.log(`KeySwitcher: UI already exists for ${provider.name}. Skipping injection.`);
                 // Optionally, force an update if needed (though redrawProviderUI will handle this later)
                 try {
                     const data = loadSetData(provider, loadedSecrets);
                     await updateProviderInfoPanel(provider, data);
                 } catch (updateError) {
                     console.error(`KeySwitcher: Error updating existing UI panel for ${provider.name}`, updateError);
                 }
                continue;
            }

            // --- Try/Catch around UI creation and injection ---
            try {
                const data = loadSetData(provider, loadedSecrets);
                console.log(`KeySwitcher: ${provider.name} initial set data:`, JSON.parse(JSON.stringify(data)));

                // --- Create Main Container ---
                const topLevelContainer = document.createElement("div");
                topLevelContainer.id = `keyswitcher-main-${provider.secret_key}`; // Added ID here
                topLevelContainer.classList.add("keyswitcher-provider-container");
                topLevelContainer.style.marginTop = "15px";
                topLevelContainer.style.border = "1px solid #444";
                topLevelContainer.style.padding = "10px";
                topLevelContainer.style.borderRadius = "5px";

                // --- Collapsible Header ---
                const collapsedKey = `keyswitcher_collapsed_${provider.secret_key}`;
                let isCollapsed = localStorage.getItem(collapsedKey) === "true";
                const headerBar = document.createElement("div");
                headerBar.style.display = "flex";
                headerBar.style.alignItems = "center";
                headerBar.style.cursor = "pointer";
                headerBar.style.userSelect = "none";
                headerBar.style.marginBottom = "8px";
                headerBar.style.gap = "8px";

                const chevron = document.createElement("span");
                chevron.textContent = isCollapsed ? "▶" : "▼";
                chevron.style.fontSize = "18px";
                chevron.style.transition = "transform 0.2s";
                chevron.style.marginRight = "4px";

                const heading = document.createElement("h4");
                heading.textContent = `${provider.name} - Key Set Manager`;
                heading.style.margin = "0";
                heading.style.flex = "1";
                heading.style.fontWeight = "bold";

                headerBar.appendChild(chevron);
                headerBar.appendChild(heading);
                topLevelContainer.appendChild(headerBar);

                // --- Collapsible content wrapper ---
                const collapsibleContent = document.createElement("div");
                collapsibleContent.style.display = isCollapsed ? "none" : "block";
                // All further UI will be appended to collapsibleContent, not topLevelContainer directly

                // Toggle logic
                headerBar.addEventListener("click", () => {
                    isCollapsed = !isCollapsed;
                    collapsibleContent.style.display = isCollapsed ? "none" : "block";
                    chevron.textContent = isCollapsed ? "▶" : "▼";
                    localStorage.setItem(collapsedKey, isCollapsed ? "true" : "false");
                });

                // --- Info Panel (with placeholders) ---
                const infoPanel = document.createElement("div");
                infoPanel.id = `keyswitcher-info-${provider.secret_key}`;
                infoPanel.style.marginBottom = "10px";
                infoPanel.style.padding = "8px";
                infoPanel.style.border = "1px dashed #666";
                infoPanel.style.borderRadius = "4px";
                const activeSetDiv = document.createElement("div"); activeSetDiv.id = `active_set_info_${provider.secret_key}`; activeSetDiv.textContent = "Active Set: Loading..."; infoPanel.appendChild(activeSetDiv);
                const currentKeyDiv = document.createElement("div");
                currentKeyDiv.id = `current_key_${provider.secret_key}`;
                currentKeyDiv.textContent = "Current Key: Loading...";
                // Responsive and non-overflowing styling
                currentKeyDiv.style.maxWidth = "100%";
                currentKeyDiv.style.wordBreak = "break-all";
                currentKeyDiv.style.display = "block";
                currentKeyDiv.style.margin = "4px 0";
                currentKeyDiv.style.padding = "2px 6px";
                currentKeyDiv.style.borderRadius = "3px";
                infoPanel.appendChild(currentKeyDiv);
                const switchStatusDiv = document.createElement("div"); switchStatusDiv.id = `switch_key_${provider.secret_key}`; switchStatusDiv.textContent = "Switching: Loading..."; infoPanel.appendChild(switchStatusDiv);
                const errorToggleDiv = document.createElement("div"); errorToggleDiv.id = `show_${provider.secret_key}_error`; errorToggleDiv.textContent = "Error Details: Loading..."; infoPanel.appendChild(errorToggleDiv);
                collapsibleContent.appendChild(infoPanel);

                // --- Global Button Container ---
                const globalButtonContainer = document.createElement("div");
                globalButtonContainer.classList.add("key-switcher-buttons", "flex-container", "flex");
                globalButtonContainer.style.marginBottom = "10px";
                globalButtonContainer.style.gap = "5px";

                // --- Create Global Buttons (using corrected createButton) ---
                const keySwitchingButton = createButton("Toggle Auto Switching/Removal", async () => {
                    keySwitchingEnabled[provider.secret_key] = !keySwitchingEnabled[provider.secret_key];
                    localStorage.setItem(`switch_key_${provider.secret_key}`, keySwitchingEnabled[provider.secret_key].toString());
                    const currentSecrets = await getSecrets() || {}; // Ensure fresh secrets/data for update
                    await updateProviderInfoPanel(provider, loadSetData(provider, currentSecrets));
                });
                const rotateManuallyButton = createButton("Rotate Key in Active Set Now", async () => {
                    console.log(`KeySwitcher: Manual rotation requested for ${provider.name}`);
                    await handleKeyRotation(provider.secret_key);
                    const currentSecrets = await getSecrets() || {};
                    await updateProviderInfoPanel(provider, loadSetData(provider, currentSecrets)); // Update panel after attempt
                });
                const errorToggleButton = createButton("Toggle Error Details Popup", async () => {
                    showErrorDetails[provider.secret_key] = !showErrorDetails[provider.secret_key];
                    localStorage.setItem(`show_${provider.secret_key}_error`, showErrorDetails[provider.secret_key].toString());
                    const currentSecrets = await getSecrets() || {};
                    await updateProviderInfoPanel(provider, loadSetData(provider, currentSecrets));
                });

                globalButtonContainer.appendChild(keySwitchingButton);
                globalButtonContainer.appendChild(rotateManuallyButton);
                globalButtonContainer.appendChild(errorToggleButton);
                collapsibleContent.appendChild(globalButtonContainer);

                // --- Dynamic Sets Container (Placeholder) ---
                const dynamicSetsContainer = document.createElement("div");
                dynamicSetsContainer.id = `keyswitcher-sets-dynamic-${provider.secret_key}`;
                collapsibleContent.appendChild(dynamicSetsContainer);

                // Add the collapsible content to the main container
                topLevelContainer.appendChild(collapsibleContent);

                // --- Inject UI ---
                console.log(`KeySwitcher: Attempting to inject UI for ${provider.name}`);
                const insertBeforeElement = formElement.querySelector('hr:not(.key-switcher-hr), button, .form_section_block'); // Try to avoid inserting before our own hr
                const separatorHr = document.createElement("hr");
                separatorHr.className = "key-switcher-hr"; // Add class to potentially ignore later

                if (insertBeforeElement) {
                    formElement.insertBefore(separatorHr, insertBeforeElement);
                    formElement.insertBefore(topLevelContainer, insertBeforeElement); // Insert container BEFORE found element
                } else {
                    console.log(`KeySwitcher: No specific insert point found for ${provider.name}, appending.`);
                    formElement.appendChild(separatorHr);
                    formElement.appendChild(topLevelContainer);
                }
                console.log(`KeySwitcher: UI Injected successfully for ${provider.name}`);

                // --- Call initial Info Panel update ---
                await updateProviderInfoPanel(provider, data);

                // --- Call initial Dynamic UI draw --- ADDED ---
                await redrawProviderUI(provider, data);



            } catch (injectionError) {
                 console.error(`KeySwitcher: *** ERROR during UI creation/injection for ${provider.name}:`, injectionError);
                 console.error(`KeySwitcher: formElement at time of error was:`, formElement);
            }
            // --- End Try/Catch ---

        } else {
             console.warn(`KeySwitcher: Could not find form element for ${provider.name} (ID: ${provider.form_id}). Skipping UI injection.`);
        }
    } // --- End of provider loop ---

    // --- Event Listeners ---
    scriptFunctions.eventSource.on(scriptFunctions.event_types.CHATCOMPLETION_MODEL_CHANGED, async (model) => { /* ...unchanged... */ });
    scriptFunctions.eventSource.on(scriptFunctions.event_types.CHAT_COMPLETION_SETTINGS_READY, async () => {
        console.log("KeySwitcher: Chat completion settings ready, checking for initial key rotation...");
        try {
            const currentSource = oaiFunctions.oai_settings.chat_completion_source;
            for (const provider of Object.values(PROVIDERS)) {
                if (isProviderSource(provider)) {
                    if (keySwitchingEnabled[provider.secret_key]) {
                        console.log(`KeySwitcher: Provider ${provider.name} is active and switching is enabled. Attempting initial key rotation.`);
                        await handleKeyRotation(provider.secret_key);
                        // Optionally update panel after rotation attempt
                        const currentSecrets = await getSecrets() || {};
                        await updateProviderInfoPanel(provider, loadSetData(provider, currentSecrets));
                    } else {
                         console.log(`KeySwitcher: Provider ${provider.name} is active but switching is disabled.`);
                    }
                    break; // Found active provider
                }
            }
        } catch(e) {
            console.error("KeySwitcher: Error during SETTINGS_READY rotation check:", e);
        }
    });

    console.log("MultiProviderKeySwitcher: Initialization complete.");
});


// Export the plugin's init function - CORRECTED
export default init;
