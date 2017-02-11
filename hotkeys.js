function sendHotkeyMessage(hotkey) {
    console.log("Sending hotkey: " + hotkey);
    chrome.runtime.sendMessage({hotkey: hotkey});
}

// TODO: Will waiting until document ready cause too much delay before the user
// can start using the hotkeys?
$(document).ready(function() {
    var HOTKEY_HOLD_KEY = 32; // Spacebar.
    var SHIFT = 16;
    // Hotkeys for navigating to left or right tab.
    var NAV_LEFT = 219;
    var NAV_RIGHT = 221;
    var TAB_SEARCH = 186;
    var NAV_LEFT_SYMBOL = '[';
    var NAV_RIGHT_SYMBOL = ']';
    var TAB_SEARCH_SYMBOL = ';';

    var holding = false;
    var shift = false;
    var hotkey = '';
    $(document).keydown(function(e) {
        switch (e.which) {
            // When spacebar pressed, block text entry and wait for hotkey.
            case HOTKEY_HOLD_KEY:
                if (!holding) {
                    console.log("Holding for hotkey...");
                    holding = true;
                }
                // TODO: Figure out how to block spacebar entry ONLY when
                // spacebar is held and a hotkey is typed (i.e. allow normal
                // text space input when it's pressed and released without
                // typing a hotkey. Or at least block further spaces being
                // entered when the last key pressed within ~100ms or whatever
                // the repeat key delay is was spacebar.
                //e.preventDefault();
                break;
            // Need to manually implement capitalization with shift since we're
            // intercepting keys.
            case SHIFT:
                shift = true;
                break;
            default:
                if (holding) {
                    // Capture a-z.
                    if (65 <= e.which && e.which <= 90) {
                        var asciiCode = e.which;
                        if (!shift) {
                            asciiCode += 32;
                        }
                        hotkey += String.fromCharCode(asciiCode);
                    }
                    // Capture left/right navigation hotkeys.
                    else if (e.which == NAV_LEFT) {
                        hotkey = NAV_LEFT_SYMBOL;
                    }
                    else if (e.which == NAV_RIGHT) {
                        hotkey = NAV_RIGHT_SYMBOL;
                    }
                    else if (e.which == TAB_SEARCH) {
                        hotkey = TAB_SEARCH_SYMBOL;
                    }
                    e.preventDefault();
                }
                break;
        }
    });

    $(document).keyup(function(e) {
        switch (e.which) {
            // When spacebar released, unblock text entry and send any hotkey
            // entered.
            // TODO: Fix false positives sending a hotkey when spacebar is held
            // while typing very fast (especially " a ").
            case HOTKEY_HOLD_KEY:
                if (hotkey.length > 0) {
                    sendHotkeyMessage(hotkey);
                    hotkey = '';
                }
                e.preventDefault();
                console.log("Released for hotkey.");
                holding = false;
                break;
            // Need to manually implement capitalization with shift since we're
            // intercepting keys.
            case SHIFT:
                shift = false;
                break;
        }
    });

    // TODO: Show visual of time left to enter hotkey before hotkey cancelled.

});
