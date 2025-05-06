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
    // --- DIAGNOSTIC LOG ADDED ---
    console.log(`KeySwitcher: redrawProviderUI called for provider:`, provider?.name, `| secret_key:`, provider?.secret_key, `| Is provider defined?`, !!provider);
    // -----------------------------

    const dynamicContainerId = `keyswitcher-sets-dynamic-${provider.secret_key}`; // This uses provider
    const dynamicContainer = document.getElementById(dynamicContainerId);
    if (!dynamicContainer) {
        console.error(`KeySwitcher: Dynamic container not found for ${provider.name} (ID: ${dynamicContainerId})`);
        return;
    }

    // --- Clear existing UI ---
    dynamicContainer.innerHTML = '';

    // --- Recycle Bin UI ---
    const oldBinId = `keyswitcher-recycle-bin-${provider.secret_key}`; // This uses provider
    const oldBin = document.getElementById(oldBinId);
    if (oldBin && dynamicContainer.contains(oldBin)) { // Check parent before removing
        oldBin.remove();
    } else if (oldBin) {
        console.warn(`KeySwitcher: Found old recycle bin (ID: ${oldBinId}), but it was not inside the dynamic container. Not removing.`);
    }

    const recycleBinSection = document.createElement("div");
    recycleBinSection.id = oldBinId;
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

    const collapseKey = `keyswitcher-recycle-collapsed-${provider.secret_key}`; // This uses provider
    let recycleCollapsed = localStorage.getItem(collapseKey) !== 'false';
    const binContent = document.createElement("div");
    binContent.style.display = recycleCollapsed ? "none" : "block";
    recycleHeader.onclick = () => {
        recycleCollapsed = !recycleCollapsed;
        localStorage.setItem(collapseKey, recycleCollapsed ? 'true' : 'false');
        binContent.style.display = recycleCollapsed ? "none" : "block";
    };

    recycleBinSection.appendChild(binContent);

    const recycleBin = loadRecycleBin(provider); // This uses provider
    if (recycleBin.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "Recycle bin is empty.";
        empty.style.fontStyle = "italic";
        binContent.appendChild(empty);
    } else {
         recycleBin.sort((a, b) => new Date(b.removedAt) - new Date(a.removedAt));
         recycleBin.forEach((entry, binIndex) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.flexDirection = "column";
            row.style.borderBottom = "1px solid #a44";
            row.style.padding = "5px 0";
            row.style.marginBottom = "5px";

            const keyRow = document.createElement("div");
            keyRow.textContent = entry.key;
            keyRow.style.wordBreak = "break-all";
            keyRow.style.fontSize = "0.95em";
            keyRow.style.background = "#1a1a1a";
            keyRow.style.color = "#e0c0c0";
            keyRow.style.padding = "2px 6px";
            keyRow.style.marginBottom = "3px";
            keyRow.style.borderRadius = "3px";
            row.appendChild(keyRow);

            const meta = document.createElement("div");
            meta.style.fontSize = "0.85em";
            meta.style.color = "#b88";
            meta.textContent =
                `Set: ${entry.set || 'N/A'} | Reason: ${entry.reason || 'N/A'} | Removed: ${new Date(entry.removedAt).toLocaleString()}`;
            row.appendChild(meta);

            const btnRow = document.createElement("div");
            btnRow.style.display = "flex";
            btnRow.style.gap = "8px";
            btnRow.style.marginTop = "4px";

            const restoreBtn = createButton("Restore", async () => {
                const currentBin = loadRecycleBin(provider); // Uses provider
                const entryToRestoreIndex = currentBin.findIndex(item => item.key === entry.key && item.removedAt === entry.removedAt);
                if (entryToRestoreIndex === -1) {
                    alert("Error: Could not find the key entry in the recycle bin storage. Cannot restore.");
                    return;
                }
                const entryToRestore = currentBin[entryToRestoreIndex];
                const loadedSecrets = await getSecrets();
                const currentData = loadSetData(provider, loadedSecrets); // Uses provider
                let targetSetIndex = currentData.sets.findIndex(s => s.name === entryToRestore.set);
                let targetSetName = entryToRestore.set;
                if (targetSetIndex === -1) {
                    targetSetIndex = currentData.activeSetIndex;
                     if (targetSetIndex < 0 || targetSetIndex >= currentData.sets.length) {
                         alert("Restore failed: Original set not found and no valid active set exists.");
                         return;
                     }
                     targetSetName = currentData.sets[targetSetIndex].name;
                     console.warn(`KeySwitcher: Original set '${entryToRestore.set}' not found. Restoring key to currently active set '${targetSetName}'.`);
                     toastr.info(`Original set '${entryToRestore.set}' not found. Restored to active set '${targetSetName}'.`);
                }
                const targetSetKeys = splitKeys(currentData.sets[targetSetIndex].keys);
                if (!targetSetKeys.includes(entryToRestore.key)) {
                    targetSetKeys.push(entryToRestore.key);
                    currentData.sets[targetSetIndex].keys = targetSetKeys.join('\n');
                    await saveSetData(provider, currentData); // Uses provider
                    console.log(`KeySwitcher: Key '${entryToRestore.key}' restored to set '${targetSetName}'.`);
                     toastr.success(`Key '${entryToRestore.key.substring(0, 8)}...' restored to set '${targetSetName}'.`);
                } else {
                     console.log(`KeySwitcher: Key '${entryToRestore.key}' already exists in set '${targetSetName}'. Not adding duplicate.`);
                     toastr.info(`Key '${entryToRestore.key.substring(0, 8)}...' already exists in set '${targetSetName}'.`);
                 }
                currentBin.splice(entryToRestoreIndex, 1);
                saveRecycleBin(provider, currentBin); // Uses provider
                localStorage.setItem(collapseKey, 'false');
                const finalSecrets = await getSecrets() || {};
                const finalData = loadSetData(provider, finalSecrets); // Uses provider
                await updateProviderInfoPanel(provider, finalData); // Uses provider
                await redrawProviderUI(provider, finalData); // Uses provider
            });
            btnRow.appendChild(restoreBtn);

            const deleteBtn = createButton("Delete Permanently", async () => {
                const currentBin = loadRecycleBin(provider); // Uses provider
                const entryToDeleteIndex = currentBin.findIndex(item => item.key === entry.key && item.removedAt === entry.removedAt);
                if (entryToDeleteIndex === -1) {
                    alert("Error: Could not find the key entry in the recycle bin storage. Cannot delete.");
                    return;
                }
                 const keyToDelete = currentBin[entryToDeleteIndex].key;
                if (confirm(`Are you sure you want to permanently delete the key "${keyToDelete}" from the recycle bin? This cannot be undone.`)) {
                    currentBin.splice(entryToDeleteIndex, 1);
                    saveRecycleBin(provider, currentBin); // Uses provider
                    console.log(`KeySwitcher: Permanently deleted key '${keyToDelete}' from recycle bin.`);
                     toastr.info(`Permanently deleted key '${keyToDelete.substring(0, 8)}...' from recycle bin.`);
                    localStorage.setItem(collapseKey, 'false');
                    const currentSecrets = await getSecrets() || {};
                    const currentData = loadSetData(provider, currentSecrets); // Uses provider
                    await redrawProviderUI(provider, currentData); // Uses provider
                }
            });
            btnRow.appendChild(deleteBtn);
            row.appendChild(btnRow);

            binContent.appendChild(row);
        });
    }
    dynamicContainer.appendChild(recycleBinSection); // Use appendChild


    const setsAreaHeader = document.createElement("h5");
    setsAreaHeader.textContent = "Key Sets Management:";
    setsAreaHeader.style.marginTop = "15px";
    setsAreaHeader.style.marginBottom = "5px";
    dynamicContainer.appendChild(document.createElement("hr"));
    dynamicContainer.appendChild(setsAreaHeader);

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
                setContainer.style.borderColor = "#8cff7a";
                setContainer.style.boxShadow = "0 0 5px #8cff7a";
            }

            const setHeader = document.createElement("div");
            setHeader.style.display = "flex";
            setHeader.style.justifyContent = "space-between";
            setHeader.style.alignItems = "center";
            setHeader.style.marginBottom = "8px";

            const setNameInput = document.createElement("input");
            setNameInput.type = "text";
            setNameInput.value = set.name;
            setNameInput.style.fontWeight = "bold";
            setNameInput.style.border = "1px solid transparent";
            setNameInput.style.background = "transparent";
            setNameInput.style.color = "inherit";
            setNameInput.style.padding = "2px 4px";
            setNameInput.style.marginRight = "10px";
            setNameInput.style.flexGrow = "1";
            setNameInput.style.cursor = "text";

            if (index === data.activeSetIndex) {
                 setNameInput.value += ' (Active)';
                 setNameInput.style.fontStyle = "italic";
                 setNameInput.title = `Set Name: ${set.name} (Currently Active)`;
                 setNameInput.readOnly = true;
            } else {
                 setNameInput.title = `Set Name: ${set.name} (Double-click to rename)`;
                 setNameInput.readOnly = false;
                setNameInput.addEventListener('dblclick', () => {
                    setNameInput.readOnly = false;
                    setNameInput.style.border = "1px solid #888";
                    setNameInput.select();
                });
                 const saveName = async () => {
                     if (setNameInput.readOnly) return;
                     const newName = setNameInput.value.trim();
                     setNameInput.readOnly = true;
                     setNameInput.style.border = "1px solid transparent";
                     if (newName && newName !== set.name) {
                         const isDuplicate = data.sets.some((s, i) => i !== index && s.name === newName);
                         if (isDuplicate) {
                             alert(`Set name "${newName}" already exists. Please choose a unique name.`);
                             setNameInput.value = set.name;
                         } else {
                             console.log(`KeySwitcher: Renaming set ${index} from '${set.name}' to '${newName}' for ${provider.name}`); // Uses provider
                             data.sets[index].name = newName;
                             await saveSetData(provider, data); // Uses provider
                             const updatedSecrets = await getSecrets() || {};
                             const updatedData = loadSetData(provider, updatedSecrets); // Uses provider
                             await redrawProviderUI(provider, updatedData); // Uses provider
                             toastr.success(`Set renamed to "${newName}".`);
                         }
                     } else {
                         setNameInput.value = set.name;
                     }
                 };
                 setNameInput.addEventListener('blur', saveName);
                 setNameInput.addEventListener('keydown', (e) => {
                     if (e.key === 'Enter') {
                         saveName();
                         setNameInput.blur();
                     } else if (e.key === 'Escape') {
                         setNameInput.value = set.name;
                         setNameInput.readOnly = true;
                         setNameInput.style.border = "1px solid transparent";
                         setNameInput.blur();
                     }
                 });
            }

            const setButtons = document.createElement("div");
            setButtons.style.display = "flex";
            setButtons.style.gap = "5px";
            setButtons.style.flexShrink = "0";

            if (index !== data.activeSetIndex) {
                const activateButton = createButton("Activate", async () => {
                    console.log(`KeySwitcher: Activating set ${index} ('${set.name}') for ${provider.name}`); // Uses provider
                    data.activeSetIndex = index;
                    await saveSetData(provider, data); // Uses provider
                    await handleKeyRotation(provider.secret_key); // Uses provider implicitly
                    const updatedSecrets = await getSecrets();
                    if (updatedSecrets) {
                        const updatedData = loadSetData(provider, updatedSecrets); // Uses provider
                        await updateProviderInfoPanel(provider, updatedData); // Uses provider
                        await redrawProviderUI(provider, updatedData); // Uses provider
                    }
                });
                activateButton.title = `Make "${set.name}" the active key set`;
                setButtons.appendChild(activateButton);
            }

            const deleteButton = createButton("Delete", async () => {
                if (confirm(`Are you sure you want to delete the key set "${set.name}"? This cannot be undone. Keys in this set will be lost.`)) {
                    console.log(`KeySwitcher: Deleting set ${index} ('${set.name}') for ${provider.name}`); // Uses provider
                    const deletedSetName = data.sets[index].name;
                    data.sets.splice(index, 1);
                    if (data.activeSetIndex === index) {
                        data.activeSetIndex = 0;
                    } else if (data.activeSetIndex > index) {
                        data.activeSetIndex--;
                    }
                     if (data.sets.length === 0) {
                        data.sets.push({ name: "Default", keys: "" });
                        data.activeSetIndex = 0;
                    }
                    await saveSetData(provider, data); // Uses provider
                    const updatedSecrets = await getSecrets();
                    if (updatedSecrets) {
                        const updatedData = loadSetData(provider, updatedSecrets); // Uses provider
                        await handleKeyRotation(provider.secret_key); // Uses provider implicitly
                        await updateProviderInfoPanel(provider, updatedData); // Uses provider
                        await redrawProviderUI(provider, updatedData); // Uses provider
                        toastr.info(`Key set "${deletedSetName}" deleted.`);
                    }
                 }
            });
             deleteButton.title = `Delete key set "${set.name}"`;
            if (data.sets.length <= 1) {
                deleteButton.disabled = true;
                deleteButton.title = "Cannot delete the only key set.";
                deleteButton.style.opacity = "0.5";
                deleteButton.style.cursor = "not-allowed";
            }
            setButtons.appendChild(deleteButton);

            setHeader.appendChild(setNameInput);
            setHeader.appendChild(setButtons);
            setContainer.appendChild(setHeader);

            const keysTextarea = document.createElement("textarea");
            keysTextarea.classList.add("text_pole", "api_key_textarea");
            keysTextarea.rows = 4;
            keysTextarea.placeholder = `Enter API keys for set "${set.name}", one per line or separated by semicolons.`;
            keysTextarea.value = set.keys || "";
            keysTextarea.style.width = "100%";
            keysTextarea.style.boxSizing = 'border-box';
            keysTextarea.style.marginTop = "5px";

            keysTextarea.addEventListener('blur', async (event) => {
                const newKeysValue = event.target.value;
                const newKeysArray = splitKeys(newKeysValue);
                const normalizedNewKeysString = newKeysArray.join('\n');
                const currentKeysArray = splitKeys(set.keys);
                const normalizedCurrentKeysString = currentKeysArray.join('\n');
                if (normalizedCurrentKeysString !== normalizedNewKeysString) {
                    console.log(`KeySwitcher: Updating keys for set ${index} ('${set.name}') for ${provider.name}`); // Uses provider
                    data.sets[index].keys = normalizedNewKeysString;
                    await saveSetData(provider, data); // Uses provider
                    if (index === data.activeSetIndex) {
                         console.log("KeySwitcher: Keys updated for the active set. Triggering rotation check.");
                        await handleKeyRotation(provider.secret_key); // Uses provider implicitly
                    }
                    event.target.value = normalizedNewKeysString;
                    toastr.success(`Keys updated for set "${set.name}".`);
                 } else {
                    event.target.value = normalizedNewKeysString;
                 }
            });

            setContainer.appendChild(keysTextarea);
            dynamicContainer.appendChild(setContainer);
        });
    }

    const addNewSetButton = createButton("Add New Set", async () => {
        let newSetName = prompt("Enter a name for the new key set:", `Set ${data.sets.length + 1}`);
        if (newSetName !== null) {
             newSetName = newSetName.trim();
             if (newSetName) {
                 const isDuplicate = data.sets.some(s => s.name === newSetName);
                 if (isDuplicate) {
                     alert(`Set name "${newSetName}" already exists. Please choose a unique name.`);
                     return;
                 }
                 console.log(`KeySwitcher: Adding new set named '${newSetName}' for ${provider.name}`); // Uses provider
                 data.sets.push({ name: newSetName, keys: "" });
                 await saveSetData(provider, data); // Uses provider
                 const updatedSecrets = await getSecrets();
                  if (updatedSecrets) {
                      const updatedData = loadSetData(provider, updatedSecrets); // Uses provider
                       toastr.success(`New key set "${newSetName}" added.`);
                      await redrawProviderUI(provider, updatedData); // Uses provider
                  }
             } else {
                 alert("Set name cannot be empty.");
             }
        }
    });
    addNewSetButton.style.marginTop = "10px";
    dynamicContainer.appendChild(addNewSetButton);
    
// --- START: Error Code Actions UI (Minimal Placeholder) --- [ADDED IN THIS STEP]
try { // Add a try...catch block for extra safety during addition
    const errorActionsSection = document.createElement("div");
    errorActionsSection.id = `keyswitcher-error-actions-${provider.secret_key}`; // Use provider here
    errorActionsSection.style.marginTop = "20px";
    errorActionsSection.style.border = "1px dashed #888";
    errorActionsSection.style.borderRadius = "4px";
    errorActionsSection.style.padding = "10px";
    errorActionsSection.style.color = "#aaa";// Simple placeholder text
errorActionsSection.textContent = "[Error Code Actions UI will be added here]";

// Append this minimal placeholder to the main dynamic container
dynamicContainer.appendChild(errorActionsSection);
console.log(`KeySwitcher: Successfully appended minimal error action placeholder for ${provider.name}`); // Confirmation log
} catch (placeholderError) {
    console.error(`KeySwitcher: *** ERROR adding minimal error action placeholder for ${provider?.name}:`, placeholderError);
    // Optionally add a visible warning in the UI itself
    if(dynamicContainer){
         const errorMsgDiv = document.createElement('div');
         errorMsgDiv.textContent = `Error adding Error Code Actions placeholder for ${provider?.name}. See console.`;
         errorMsgDiv.style.color = 'red';
         errorMsgDiv.style.marginTop = '10px';
         dynamicContainer.appendChild(errorMsgDiv);
    }
}
// --- END: Error Code Actions UI (Minimal Placeholder) ---

} // --- End of redrawProviderUI function ---

// --- Main Initialization Logic ---
jQuery(async () => {
    console.log("MultiProviderKeySwitcher: Initializing...");

    // Override toastr.error to intercept API errors and handle key switching/removal
    const originalToastrError = toastr.error;
    toastr.error = async function(...args) {
        originalToastrError(...args);
        console.log("KeySwitcher: Toastr Error Args:", args);
        // console.error(...args); // Original toastr likely logs this
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
                    const isRemovalStatusCode = statusCode && REMOVAL_STATUS_CODES.includes(statusCode); // Check statusCode exists
                    const isRemovalMessage = REMOVAL_MESSAGE_REGEX.test(errorMessage);
                    if (isRemovalStatusCode || isRemovalMessage) {
                        console.log(`KeySwitcher: Removal trigger matched for ${provider.name} (Status: ${statusCode}, MessageMatch: ${isRemovalMessage}). Attempting removal...`);
                        // Extract a more meaningful removal reason from errorMessage
                        let removalReason = "Unknown";
                        try {
                            const jsonMatch = errorMessage.match(/({.*})/);
                            if (jsonMatch && jsonMatch[1]) {
                                const parsed = JSON.parse(jsonMatch[1]);
                                if (parsed?.error?.message) { // Optional chaining
                                    removalReason = `${statusCode ? statusCode + ': ' : ''}${parsed.error.message}`;
                                } else {
                                     removalReason = `${statusCode ? statusCode + ': ' : ''}` + errorMessage.split('\n')[0].slice(0, 120);
                                }
                            } else {
                                removalReason = `${statusCode ? statusCode + ': ' : ''}` + errorMessage.split('\n')[0].slice(0, 120);
                            }
                        } catch {
                                removalReason = `${statusCode ? statusCode + ': ' : ''}` + errorMessage.split('\n')[0].slice(0, 120);
                         }
                        const newKey = await handleKeyRemoval(provider, failedKey, removalReason); // Pass reason
                        if (newKey !== null) {
                             keyRemoved = true;
                             removedKeyValue = failedKey;
                             console.log(`KeySwitcher: Key ${failedKey} supposedly removed, new key is '${newKey || "None"}'`);
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
                 break; // Found active provider, stop iterating
            }
        }
    }; // End of toastr.error override

    // Get initial secrets
    const loadedSecrets = await getSecrets();
    if (!loadedSecrets) {
        console.error("KeySwitcher: Failed to load secrets on initial load. UI setup aborted.");
        toastr.error("KeySwitcher: Failed to load secrets. Key management UI disabled.", "Initialization Error");
        return; // Stop execution if secrets failed to load
    }
    await init(loadedSecrets); // Call original init function

    // Process each provider - Setup UI
    for (const provider of Object.values(PROVIDERS)) {
        console.log(`KeySwitcher: Processing provider UI for: ${provider.name}`);
        const formElement = provider.get_form();
        // console.log(`KeySwitcher: >>> Result of get_form() for ${provider.name}:`, formElement); // Usually too verbose

        if (formElement) { // START: if (formElement)
            // Check if UI already injected (simple check for our main container)
            if (formElement.querySelector(`#keyswitcher-main-${provider.secret_key}`)) {
                console.log(`KeySwitcher: UI already exists for ${provider.name}. Forcing update.`);
                 // Force update in case data changed elsewhere
                 try {
                     const data = loadSetData(provider, loadedSecrets);
                     await updateProviderInfoPanel(provider, data);
                     await redrawProviderUI(provider, data); // Redraw dynamic parts too
                 } catch (updateError) {
                     console.error(`KeySwitcher: Error updating existing UI panel for ${provider.name}`, updateError);
                 }
                continue; // Skip re-injection for this provider
            }

            // --- Try/Catch around UI creation and injection ---
            try {
                const data = loadSetData(provider, loadedSecrets);
                console.log(`KeySwitcher: ${provider.name} initial set data:`, JSON.parse(JSON.stringify(data))); // Log initial data

                // --- Create Main Container ---
                const topLevelContainer = document.createElement("div");
                topLevelContainer.id = `keyswitcher-main-${provider.secret_key}`;
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
                headerBar.style.marginBottom = isCollapsed ? "0" : "8px"; // Adjust margin
                headerBar.style.gap = "8px";
                headerBar.title = `Click to ${isCollapsed ? 'expand' : 'collapse'} ${provider.name} Key Set Manager`;


                const chevron = document.createElement("span");
                chevron.textContent = isCollapsed ? "▶" : "▼";
                chevron.style.fontSize = "18px";
                chevron.style.transition = "transform 0.2s";
                chevron.style.marginRight = "4px";
                chevron.style.width = "1em";
                chevron.style.textAlign = "center";


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
                collapsibleContent.id = `keyswitcher-content-${provider.secret_key}`; // Give content an ID
                collapsibleContent.style.display = isCollapsed ? "none" : "block";
                collapsibleContent.style.transition = "opacity 0.3s ease-out";
                collapsibleContent.style.overflow = "hidden";


                // Toggle logic
                headerBar.addEventListener("click", () => {
                    isCollapsed = !isCollapsed;
                    collapsibleContent.style.display = isCollapsed ? "none" : "block";
                    chevron.textContent = isCollapsed ? "▶" : "▼";
                    headerBar.style.marginBottom = isCollapsed ? "0" : "8px";
                    headerBar.title = `Click to ${isCollapsed ? 'expand' : 'collapse'} ${provider.name} Key Set Manager`;
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
                // Styles for currentKeyDiv
                currentKeyDiv.style.maxWidth = "100%";
                currentKeyDiv.style.wordBreak = "break-all";
                currentKeyDiv.style.display = "block";
                currentKeyDiv.style.margin = "4px 0";
                currentKeyDiv.style.padding = "2px 6px";
                currentKeyDiv.style.borderRadius = "3px";
                currentKeyDiv.style.background = "rgba(255, 255, 255, 0.05)";
                infoPanel.appendChild(currentKeyDiv);
                const switchStatusDiv = document.createElement("div"); switchStatusDiv.id = `switch_key_${provider.secret_key}`; switchStatusDiv.textContent = "Switching: Loading..."; infoPanel.appendChild(switchStatusDiv);
                const errorToggleDiv = document.createElement("div"); errorToggleDiv.id = `show_${provider.secret_key}_error`; errorToggleDiv.textContent = "Error Details: Loading..."; infoPanel.appendChild(errorToggleDiv);
                collapsibleContent.appendChild(infoPanel); // Add to collapsible content

                // --- Global Button Container ---
                const globalButtonContainer = document.createElement("div");
                globalButtonContainer.classList.add("key-switcher-buttons", "flex-container", "flex");
                globalButtonContainer.style.marginBottom = "10px";
                globalButtonContainer.style.gap = "5px";
                globalButtonContainer.style.flexWrap = "wrap"; // Allow wrapping

                // --- Create Global Buttons ---
                const keySwitchingButton = createButton("Toggle Auto Switching/Removal", async () => {
                    keySwitchingEnabled[provider.secret_key] = !keySwitchingEnabled[provider.secret_key];
                    localStorage.setItem(`switch_key_${provider.secret_key}`, keySwitchingEnabled[provider.secret_key].toString());
                    const currentSecrets = await getSecrets() || {};
                    await updateProviderInfoPanel(provider, loadSetData(provider, currentSecrets));
                    toastr.info(`${provider.name} Auto Switching/Removal: ${keySwitchingEnabled[provider.secret_key] ? 'ON' : 'OFF'}`);
                });
                const rotateManuallyButton = createButton("Rotate Key Now", async () => {
                    console.log(`KeySwitcher: Manual rotation requested for ${provider.name}`);
                    const currentKeyBefore = await secretsFunctions.findSecret(provider.secret_key);
                    await handleKeyRotation(provider.secret_key); // This function updates the panel
                    const currentKeyAfter = await secretsFunctions.findSecret(provider.secret_key);
                    if (currentKeyBefore !== currentKeyAfter) {
                         toastr.success(`${provider.name}: Manually rotated to next key.`);
                     } else {
                         toastr.info(`${provider.name}: No other keys available in the active set to rotate to.`);
                     }
                });
                const errorToggleButton = createButton("Toggle Error Details Popup", async () => {
                    showErrorDetails[provider.secret_key] = !showErrorDetails[provider.secret_key];
                    localStorage.setItem(`show_${provider.secret_key}_error`, showErrorDetails[provider.secret_key].toString());
                    const currentSecrets = await getSecrets() || {};
                    await updateProviderInfoPanel(provider, loadSetData(provider, currentSecrets));
                    toastr.info(`${provider.name} Error Details Popup: ${showErrorDetails[provider.secret_key] ? 'ON' : 'OFF'}`);
                });

                globalButtonContainer.appendChild(keySwitchingButton);
                globalButtonContainer.appendChild(rotateManuallyButton);
                globalButtonContainer.appendChild(errorToggleButton);
                collapsibleContent.appendChild(globalButtonContainer); // Add to collapsible content

                // --- Dynamic Sets Container (Placeholder) ---
                const dynamicSetsContainer = document.createElement("div");
                dynamicSetsContainer.id = `keyswitcher-sets-dynamic-${provider.secret_key}`; // ID used by redrawProviderUI
                collapsibleContent.appendChild(dynamicSetsContainer); // Add to collapsible content

                // Add the collapsible content to the main container *AFTER* it's populated
                topLevelContainer.appendChild(collapsibleContent);

                // --- Inject UI ---
                console.log(`KeySwitcher: Attempting to inject UI for ${provider.name}`);
                // Find insertion point
                const insertBeforeElement = formElement.querySelector('.form_section_block, hr:not(.key-switcher-hr), button.menu_button');
                const separatorHr = document.createElement("hr");
                separatorHr.className = "key-switcher-hr";

                if (insertBeforeElement) {
                    console.log(`KeySwitcher: Inserting UI before element:`, insertBeforeElement);
                    formElement.insertBefore(separatorHr, insertBeforeElement);
                    formElement.insertBefore(topLevelContainer, insertBeforeElement);
                } else {
                    console.log(`KeySwitcher: No specific insert point found for ${provider.name}, appending.`);
                    formElement.appendChild(separatorHr);
                    formElement.appendChild(topLevelContainer);
                }
                console.log(`KeySwitcher: UI Injected successfully for ${provider.name}`);

                // --- Call initial Info Panel update ---
                await updateProviderInfoPanel(provider, data);

                // --- Call initial Dynamic UI draw ---
                await redrawProviderUI(provider, data);

            } catch (injectionError) { // Catch errors during UI creation/injection for THIS provider
                 console.error(`KeySwitcher: *** ERROR during UI creation/injection for ${provider.name}:`, injectionError);
                 console.error(`KeySwitcher: formElement at time of error was:`, formElement); // Log the form element for context
                 toastr.error(`KeySwitcher failed to create UI for ${provider.name}. Check console (F12).`, "UI Error");
            }
            // --- End Try/Catch for UI creation ---

        } else { // Corresponds to 'if (formElement)'
             console.warn(`KeySwitcher: Could not find form element for ${provider.name} (ID: ${provider.form_id}). Skipping UI injection.`);
        } // --- THIS is the CORRECT closing brace for 'if (formElement)' ---

    } // --- End of 'for (const provider of Object.values(PROVIDERS))' loop ---

    // --- Event Listeners ---
     // Update relevant provider UI on model change IF the provider itself changes
     scriptFunctions.eventSource.on(scriptFunctions.event_types.CHATCOMPLETION_MODEL_CHANGED, async (model) => {
         console.log("KeySwitcher: Model changed event received.");
         try {
             const currentSecrets = await getSecrets() || {};
             for (const provider of Object.values(PROVIDERS)) {
                 if (isProviderSource(provider)) {
                     console.log(`KeySwitcher: Active source is now ${provider.name}. Updating UI and potentially rotating.`);
                     const data = loadSetData(provider, currentSecrets);
                     await updateProviderInfoPanel(provider, data);
                     if (keySwitchingEnabled[provider.secret_key]) {
                        console.log(`KeySwitcher: Triggering rotation check for newly active provider ${provider.name}.`);
                        await handleKeyRotation(provider.secret_key);
                     } else {
                         console.log(`KeySwitcher: Auto-switching is disabled for newly active provider ${provider.name}, no rotation triggered.`);
                     }
                      const contentContainer = document.getElementById(`keyswitcher-content-${provider.secret_key}`);
                      if (!contentContainer || contentContainer.style.display !== 'none') {
                           await redrawProviderUI(provider, data);
                      } else {
                          console.log(`KeySwitcher: UI for ${provider.name} is collapsed, skipping redraw on model change.`);
                      }
                     break;
                 }
             }
         } catch (e) {
             console.error("KeySwitcher: Error during MODEL_CHANGED UI update:", e);
         }
     });

    // Initial rotation check and UI draw when settings are ready
    scriptFunctions.eventSource.on(scriptFunctions.event_types.CHAT_COMPLETION_SETTINGS_READY, async () => {
        console.log("KeySwitcher: Chat completion settings ready, checking initial state...");
        try {
            const currentSecrets = await getSecrets() || {};
            for (const provider of Object.values(PROVIDERS)) {
                if (isProviderSource(provider)) {
                    console.log(`KeySwitcher: Initial active source is ${provider.name}.`);
                     const data = loadSetData(provider, currentSecrets);
                     const container = document.getElementById(`keyswitcher-main-${provider.secret_key}`);
                     if (container) {
                        await updateProviderInfoPanel(provider, data);
                        await redrawProviderUI(provider, data); // Initial draw
                        if (keySwitchingEnabled[provider.secret_key]) {
                            console.log(`KeySwitcher: Switching enabled for ${provider.name}. Attempting initial key validation/rotation.`);
                            await handleKeyRotation(provider.secret_key);
                        } else {
                             console.log(`KeySwitcher: Switching disabled for initial provider ${provider.name}. Key validation/rotation skipped.`);
                             const activeKey = await secretsFunctions.findSecret(provider.secret_key);
                             const keyDisplay = document.getElementById(`current_key_${provider.secret_key}`);
                             if (keyDisplay && keyDisplay.textContent !== `Current Key: ${activeKey || 'N/A'}`) {
                                 keyDisplay.textContent = `Current Key: ${activeKey || 'N/A'}`;
                             }
                        }
                     } else {
                         console.warn(`KeySwitcher: UI container for active provider ${provider.name} not found on SETTINGS_READY.`);
                     }
                    break;
                }
            }
        } catch(e) {
            console.error("KeySwitcher: Error during SETTINGS_READY check:", e);
        }
    }); // End of SETTINGS_READY listener

    console.log("MultiProviderKeySwitcher: Initialization complete.");
}); // --- END of jQuery(async () => { ... }) ---


// Export the plugin's init function - CORRECTED
export default init;
