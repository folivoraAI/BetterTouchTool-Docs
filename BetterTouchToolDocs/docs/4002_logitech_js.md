# Logitech JavaScript API Documentation

BetterTouchTool >= 5.798 provides a JavaScript API for controlling Logitech HID++ devices (mice, keyboards). All functions support async/await and return Promises. You can use these within the predefined action "Run Real Java Script". Also have a look at [BTT Real Java Script](1106_java_script.md)
## Table of Contents

- [Lifecycle Functions](#lifecycle-functions)
- [Device Discovery](#device-discovery)
- [DPI Control](#dpi-control)
- [LED Control](#led-control)
- [Report Rate](#report-rate)
- [Battery Status](#battery-status)
- [Profile Management](#profile-management)
- [Button Control](#button-control)
- [Scroll Wheel / SmartShift](#scroll-wheel--smartshift)
- [Pointer Speed](#pointer-speed)
- [Keyboard Backlight](#keyboard-backlight)
- [DPI Quick Adjustment](#dpi-quick-adjustment)
- [Haptic Feedback](#haptic-feedback)
- [Utility Functions](#utility-functions)
- [Feature Cache Management](#feature-cache-management)
- [Receiver Pairing](#receiver-pairing)
- [Error Handling](#error-handling)

---

## Lifecycle Functions

### logitech_start()

Starts the Logitech device manager and begins device discovery.

```javascript
const result = await logitech_start();
// Returns: { success: true, started: true }
// Or if already running: { success: true, alreadyRunning: true }
```

### logitech_stop()

Stops the Logitech device manager.

```javascript
const result = await logitech_stop();
// Returns: { success: true }
```

### logitech_is_running()

Checks if the Logitech device manager is currently running.

```javascript
const result = await logitech_is_running();
// Returns: { isRunning: true } or { isRunning: false }
```

### logitech_scan_devices()

Triggers a scan for known Logitech devices.

```javascript
const result = await logitech_scan_devices();
// Returns: { success: true }
```

---

## Device Discovery

### logitech_get_devices()

Returns a list of all connected Logitech HID++ devices.

```javascript
const result = await logitech_get_devices();
// Returns:
// {
//   count: 2,
//   devices: [
//     {
//       name: "G502 HERO",
//       vendorID: 1133,
//       productID: 49291,
//       protocolMajor: 4,
//       protocolMinor: 2,
//       protocolVersion: "4.2",
//       isReady: true,
//       features: {
//         supportsDPI: true,
//         supportsLED: true,
//         supportsButtons: true,
//         supportsProfiles: true,
//         supportsScrollWheel: true,
//         supportsBattery: false,
//         supportsReportRate: true,
//         supportsPointerSpeed: true,
//         supportsHapticFeedback: false,  // MX Master 4 and similar
//         supportsBacklight: false        // Keyboards only
//       }
//     },
//     ...
//   ]
// }
```

**Example: List all connected devices**

```javascript
async function listDevices() {
    const result = await logitech_get_devices();

    for (const device of result.devices) {
        log(`Device: ${device.name}`);
        log(`  Protocol: HID++ ${device.protocolVersion}`);
        log(`  DPI Support: ${device.features.supportsDPI}`);
        log(`  LED Support: ${device.features.supportsLED}`);
    }

    return `Found ${result.count} device(s)`;
}
```

---

## DPI Control

### logitech_get_dpi(options)

Gets the current DPI setting for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| sensorIndex | number | No | Sensor index (default: primary sensor) |

```javascript
const result = await logitech_get_dpi({ deviceName: "G502 HERO" });
// Returns: { dpi: 1600 }
// Or on error: { error: "Error message" }
```

### logitech_set_dpi(options)

Sets the DPI for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| dpi | number | Yes | DPI value to set |
| sensorIndex | number | No | Sensor index (default: primary sensor) |

```javascript
const result = await logitech_set_dpi({ deviceName: "G502 HERO", dpi: 1600 });
// Returns: { success: true, actualDPI: 1600 }
// Note: actualDPI may differ if device only supports specific DPI steps
```

### logitech_get_dpi_capabilities(options)

Gets the DPI capabilities and ranges for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_dpi_capabilities({ deviceName: "G502 HERO" });
// Returns:
// {
//   sensors: [
//     {
//       index: 0,
//       currentDPI: 1600,
//       minDPI: 100,
//       maxDPI: 25600,
//       dpiSteps: 50,
//       availableDPIs: []  // Empty if continuous range, or list of fixed values
//     }
//   ]
// }
```

**Example: Increase DPI by 100**

```javascript
async function increaseDPI() {
    const deviceName = "G502 HERO";

    // Get current DPI
    const current = await logitech_get_dpi({ deviceName });
    if (current.error) {
        return `Error: ${current.error}`;
    }

    // Increase by 100
    const newDPI = current.dpi + 100;
    const result = await logitech_set_dpi({ deviceName, dpi: newDPI });

    if (result.error) {
        return `Error: ${result.error}`;
    }

    return `DPI changed from ${current.dpi} to ${result.actualDPI}`;
}
```

**Example: Cycle through DPI presets**

```javascript
async function cycleDPI() {
    const deviceName = "G502 HERO";
    const presets = [800, 1600, 3200, 6400];

    const current = await logitech_get_dpi({ deviceName });
    if (current.error) return `Error: ${current.error}`;

    // Find next preset
    let nextIndex = 0;
    for (let i = 0; i < presets.length; i++) {
        if (current.dpi < presets[i]) {
            nextIndex = i;
            break;
        }
        if (i === presets.length - 1) {
            nextIndex = 0; // Wrap around
        }
    }

    const result = await logitech_set_dpi({ deviceName, dpi: presets[nextIndex] });
    return `DPI set to ${result.actualDPI}`;
}
```

---

## LED Control

### logitech_set_led_color(options)

Sets the LED color for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| red | number | Yes | Red value (0-255) |
| green | number | Yes | Green value (0-255) |
| blue | number | Yes | Blue value (0-255) |
| zones | array | No | Array of zone indices to set (default: all zones) |
| enableHostMode | boolean | No | Enable host control mode |
| persist | boolean | No | Persist the color setting |

```javascript
// Set all LEDs to red
const result = await logitech_set_led_color({
    deviceName: "G502 HERO",
    red: 255,
    green: 0,
    blue: 0
});
// Returns: { success: true }

// Set specific zones to blue
const result2 = await logitech_set_led_color({
    deviceName: "G502 HERO",
    red: 0,
    green: 0,
    blue: 255,
    zones: [0, 1],  // Only zones 0 and 1
    persist: true   // Save to device memory
});
```

**Example: Color based on battery level**

```javascript
async function setBatteryColor() {
    const deviceName = "MX Master 3";

    const battery = await logitech_get_battery_status({ deviceName });
    if (battery.error) return `Error: ${battery.error}`;

    let red = 0, green = 255, blue = 0;

    if (battery.level < 20) {
        red = 255; green = 0;  // Red for low battery
    } else if (battery.level < 50) {
        red = 255; green = 165;  // Orange for medium
    }

    await logitech_set_led_color({ deviceName, red, green, blue });
    return `Battery: ${battery.level}%`;
}
```

---

## Report Rate

### logitech_get_report_rate(options)

Gets the current USB report rate (polling rate) for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_report_rate({ deviceName: "G502 HERO" });
// Returns: { rateHz: 1000 }
```

### logitech_set_report_rate(options)

Sets the USB report rate for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| rateHz | number | Yes | Report rate in Hz (e.g., 125, 250, 500, 1000) |

```javascript
const result = await logitech_set_report_rate({
    deviceName: "G502 HERO",
    rateHz: 1000
});
// Returns: { success: true }
```

### logitech_get_supported_report_rates(options)

Gets the list of supported report rates for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_supported_report_rates({ deviceName: "G502 HERO" });
// Returns: { rates: [125, 250, 500, 1000] }
```

**Example: Toggle between 500Hz and 1000Hz**

```javascript
async function toggleReportRate() {
    const deviceName = "G502 HERO";

    const current = await logitech_get_report_rate({ deviceName });
    const newRate = current.rateHz === 1000 ? 500 : 1000;

    await logitech_set_report_rate({ deviceName, rateHz: newRate });
    return `Report rate set to ${newRate}Hz`;
}
```

---

## Battery Status

### logitech_get_battery_status(options)

Gets the battery status for a wireless device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_battery_status({ deviceName: "MX Master 3" });
// Returns:
// {
//   level: 85,           // Battery percentage (0-100)
//   status: "discharging"  // "discharging", "charging", "full", or "invalid"
// }
```

**Example: Show battery notification**

```javascript
async function checkBattery() {
    const deviceName = "MX Master 3";

    const battery = await logitech_get_battery_status({ deviceName });
    if (battery.error) return `Error: ${battery.error}`;

    if (battery.level < 20) {
        // Use BTT to show a notification
        await trigger_action({
            json: JSON.stringify({
                BTTPredefinedActionType: 309,  // Show notification
                BTTNotificationTitle: "Low Battery Warning",
                BTTNotificationText: `${deviceName}: ${battery.level}%`
            })
        });
    }

    return `${deviceName}: ${battery.level}% (${battery.status})`;
}
```

---

## Profile Management

### logitech_get_mode(options)

Gets the current operating mode (host or onboard) for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_mode({ deviceName: "G502 HERO" });
// Returns: { mode: "host" } or { mode: "onboard" }
```

### logitech_set_mode(options)

Sets the operating mode for a device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| mode | string | Yes | "host" or "onboard" |

- **host**: BTT controls the device (required for button remapping)
- **onboard**: Device uses its onboard profile settings

```javascript
const result = await logitech_set_mode({
    deviceName: "G502 HERO",
    mode: "host"
});
// Returns: { success: true }
```

### logitech_get_active_profile(options)

Gets the currently active profile index.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_active_profile({ deviceName: "G502 HERO" });
// Returns: { profileIndex: 0 }
```

### logitech_set_active_profile(options)

Sets the active profile by index.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| profileIndex | number | Yes | Profile index (typically 0-4) |

```javascript
const result = await logitech_set_active_profile({
    deviceName: "G502 HERO",
    profileIndex: 1
});
// Returns: { success: true }
```

**Example: Cycle through profiles**

```javascript
async function cycleProfile() {
    const deviceName = "G502 HERO";
    const maxProfiles = 5;

    const current = await logitech_get_active_profile({ deviceName });
    if (current.error) return `Error: ${current.error}`;

    const nextProfile = (current.profileIndex + 1) % maxProfiles;
    await logitech_set_active_profile({ deviceName, profileIndex: nextProfile });

    return `Switched to profile ${nextProfile + 1}`;
}
```

---

## Button Control

### logitech_get_buttons(options)

Gets information about all buttons on the device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_buttons({ deviceName: "G502 HERO" });
// Returns:
// {
//   buttons: [
//     {
//       controlId: 80,    // 0x0050 = Left Click
//       taskId: 80,       // Current mapping
//       flags: 0,
//       position: 0,
//       group: 1
//     },
//     {
//       controlId: 81,    // 0x0051 = Right Click
//       taskId: 81,
//       flags: 0,
//       position: 1,
//       group: 1
//     },
//     ...
//   ]
// }
```

**Common Control IDs:**

| ID (Hex) | ID (Dec) | Button |
|----------|----------|--------|
| 0x0050 | 80 | Left Click |
| 0x0051 | 81 | Right Click |
| 0x0052 | 82 | Middle Click |
| 0x0053 | 83 | Back |
| 0x0056 | 86 | Forward |
| 0x00C3 | 195 | Thumb Button |
| 0x00C4 | 196 | DPI Shift |
| 0x00D7 | 215 | Scroll Left |
| 0x00D8 | 216 | Scroll Right |

### logitech_divert_button(options)

Diverts a button to be handled by the host (BTT) instead of the device.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| controlId | number | Yes | Control ID of the button |

```javascript
// Divert the thumb button (0x00C3) to BTT
const result = await logitech_divert_button({
    deviceName: "G502 HERO",
    controlId: 0x00C3
});
// Returns: { success: true }
```

**Example: List all buttons**

```javascript
async function listButtons() {
    const deviceName = "G502 HERO";

    const result = await logitech_get_buttons({ deviceName });
    if (result.error) return `Error: ${result.error}`;

    let output = `Buttons on ${deviceName}:\n`;
    for (const btn of result.buttons) {
        output += `  Control ID: 0x${btn.controlId.toString(16).toUpperCase().padStart(4, '0')}`;
        output += ` (${btn.controlId}), Task: ${btn.taskId}\n`;
    }

    return output;
}
```

### logitech_undivert_button(options)

Restores a button to be handled by the device instead of BTT.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| controlId | number | Yes | Control ID of the button |

```javascript
const result = await logitech_undivert_button({
    deviceName: "G502 HERO",
    controlId: 0x00C3
});
// Returns: { success: true }
```

---

## Scroll Wheel / SmartShift

### logitech_get_ratchet_state(options)

Gets the current scroll wheel ratchet/freespin state.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_ratchet_state({ deviceName: "MX Master 3" });
// Returns: { ratchet: true, state: "ratchet" }
// Or: { ratchet: false, state: "freespin" }
```

### logitech_set_ratchet_state(options)

Sets the scroll wheel to ratchet or freespin mode.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the device. If omitted, applies to ALL mice with scroll wheel support |
| ratchet | boolean | Yes | true for ratchet mode, false for freespin |

```javascript
// Set ratchet mode on a specific mouse
const result = await logitech_set_ratchet_state({
    deviceName: "MX Master 3",
    ratchet: false  // Enable freespin
});
// Returns: { success: true }

// Set ratchet mode on ALL connected Logitech mice
const result2 = await logitech_set_ratchet_state({
    ratchet: true  // Enable ratchet on all mice
});
```

### logitech_toggle_ratchet(options)

Toggles the scroll wheel between ratchet and freespin mode. This is the simplest way to switch modes - it reads the current state and flips it.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the device. If omitted, applies to ALL mice with scroll wheel support |

```javascript
// Toggle ratchet mode on a specific mouse
const result = await logitech_toggle_ratchet({ deviceName: "MX Master 3" });
// Returns: { ratchet: false, state: "freespin" }  // or { ratchet: true, state: "ratchet" }

// Toggle ratchet mode on ALL connected Logitech mice
const result2 = await logitech_toggle_ratchet({});
```

### logitech_get_smartshift_mode(options)

Gets the SmartShift mode and auto-disengage threshold.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_smartshift_mode({ deviceName: "MX Master 3" });
// Returns: { mode: "ratchet", autoDisengage: 10 }
```

### logitech_set_smartshift_mode(options)

Sets the SmartShift mode and auto-disengage threshold.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| mode | string | Yes | "freespin" or "ratchet" |
| autoDisengage | number | No | Auto-disengage threshold (0-50) |

```javascript
const result = await logitech_set_smartshift_mode({
    deviceName: "MX Master 3",
    mode: "ratchet",
    autoDisengage: 10
});
// Returns: { success: true }
```

### logitech_get_smartshift_settings(options)

Gets detailed SmartShift settings including torque (for devices that support it).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_smartshift_settings({ deviceName: "MX Master 3" });
// Returns:
// {
//   mode: 2,
//   modeString: "ratchet",
//   ratchet: true,
//   autoDisengage: 10,
//   torque: 50  // 0 for standard SmartShift, 1-100 for Enhanced
// }
```

### logitech_set_smartshift(options)

Sets SmartShift settings (works with both standard and enhanced SmartShift).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| ratchet | boolean | Yes | true for ratchet, false for freespin |
| autoDisengage | number | Yes | Auto-disengage threshold (0-50) |
| torque | number | No | Torque value 1-100 (only for Enhanced SmartShift) |

```javascript
const result = await logitech_set_smartshift({
    deviceName: "MX Master 3",
    ratchet: true,
    autoDisengage: 15,
    torque: 50  // Optional, for Enhanced SmartShift
});
// Returns: { success: true }
```

### logitech_get_smartshift_enhanced_settings(options)

Gets Enhanced SmartShift settings (Feature 0x2111).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_smartshift_enhanced_settings({ deviceName: "MX Master 3S" });
// Returns:
// {
//   mode: 2,
//   modeString: "ratchet",
//   ratchet: true,
//   autoDisengage: 10,
//   torque: 50
// }
```

### logitech_set_smartshift_enhanced(options)

Sets Enhanced SmartShift settings (Feature 0x2111).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| ratchet | boolean | Yes | true for ratchet, false for freespin |
| autoDisengage | number | Yes | Auto-disengage threshold (0-50) |
| torque | number | Yes | Torque value (1-100) |

```javascript
const result = await logitech_set_smartshift_enhanced({
    deviceName: "MX Master 3S",
    ratchet: true,
    autoDisengage: 10,
    torque: 60
});
// Returns: { success: true }
```

### logitech_get_hires_scrolling(options)

Gets the high-resolution scrolling state.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_hires_scrolling({ deviceName: "MX Master 3" });
// Returns: { enabled: true, inverted: false }
```

### logitech_set_hires_scrolling(options)

Sets high-resolution scrolling options.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| enabled | boolean | Yes* | Enable/disable hi-res scrolling |
| inverted | boolean | No | Invert scroll direction |
| mode | number | No | Raw mode value (overrides enabled if set) |

*Either `enabled` or `mode` must be provided.

```javascript
const result = await logitech_set_hires_scrolling({
    deviceName: "MX Master 3",
    enabled: true,
    inverted: false
});
// Returns: { success: true }
```

### logitech_get_thumbwheel_info(options)

Gets thumbwheel configuration (for mice with horizontal scroll wheels like MX Master).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_thumbwheel_info({ deviceName: "MX Master 3" });
// Returns: { nativeResolution: true, diverted: false }
```

### logitech_set_thumbwheel(options)

Configures the thumbwheel settings.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| invert | boolean | No | Invert scroll direction |
| divert | boolean | No | Divert to host for BTT handling |

```javascript
const result = await logitech_set_thumbwheel({
    deviceName: "MX Master 3",
    invert: true,
    divert: false
});
// Returns: { success: true }
```

**Example: Toggle scroll wheel mode**

```javascript
// Simple toggle using the dedicated function
async function toggleScrollMode() {
    const result = await logitech_toggle_ratchet({ deviceName: "MX Master 3" });
    return `Scroll mode: ${result.state}`;
}

// Or toggle ALL mice at once
async function toggleAllMice() {
    const result = await logitech_toggle_ratchet({});
    return `Scroll mode: ${result.state}`;
}
```

---

## Pointer Speed

### logitech_get_pointer_speed(options)

Gets the current pointer speed/acceleration setting.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_get_pointer_speed({ deviceName: "G502 HERO" });
// Returns:
// {
//   speed: 256,       // Raw value (256 = 1.0x)
//   multiplier: 1.0,  // Calculated multiplier
//   percentage: 100   // As percentage
// }
```

### logitech_set_pointer_speed(options)

Sets the pointer speed/acceleration.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| speed | number | Yes | Speed value (256 = 1.0x, 512 = 2.0x, etc.) |

```javascript
const result = await logitech_set_pointer_speed({
    deviceName: "G502 HERO",
    speed: 384  // 1.5x speed
});
// Returns: { success: true }
```

---

## Keyboard Backlight

Control keyboard backlight on supported Logitech keyboards (MX Keys, MX Keys S, Craft, MX Mechanical, etc.).

### logitech_get_backlight_state(options)

Gets the current backlight state including mode, level, and timeout durations.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the keyboard |

```javascript
const result = await logitech_get_backlight_state({ deviceName: "MX Keys S" });
// Returns:
// {
//   success: true,
//   enabled: true,
//   mode: "automatic",      // "disabled", "enabled", "automatic", or "manual"
//   modeValue: 1,           // Raw mode value
//   level: 5,               // Current brightness (0-maxLevel)
//   maxLevel: 10,           // Maximum brightness level
//   supportsAutomatic: true,
//   supportsManual: true,
//   durationHandsOut: 55,   // Seconds until dim when hands away
//   durationHandsIn: 55,    // Seconds until dim when hands nearby
//   durationPowered: 300    // Seconds until dim on external power
// }
```

### logitech_set_backlight_enabled(options)

Enables or disables the keyboard backlight.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the keyboard |
| enabled | boolean | Yes | true to enable, false to disable |

```javascript
const result = await logitech_set_backlight_enabled({
    deviceName: "MX Keys S",
    enabled: true
});
// Returns: { success: true }
```

### logitech_set_backlight_mode(options)

Sets the backlight mode.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the keyboard |
| mode | string/number | Yes | Mode: "disabled", "enabled", "automatic", "manual" (or raw value) |

**Modes:**
- `"disabled"` - Backlight off
- `"enabled"` - Backlight on (basic)
- `"automatic"` - Brightness adjusts based on ambient light and hand proximity
- `"manual"` - Fixed brightness level

```javascript
const result = await logitech_set_backlight_mode({
    deviceName: "MX Keys S",
    mode: "automatic"
});
// Returns: { success: true }
```

### logitech_set_backlight_level(options)

Sets the backlight brightness level. Automatically switches to manual mode if needed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the keyboard |
| level | number | Yes | Brightness level (0 to maxLevel, typically 0-10) |

```javascript
const result = await logitech_set_backlight_level({
    deviceName: "MX Keys S",
    level: 7
});
// Returns: { success: true }
```

### logitech_set_backlight(options)

Sets the complete backlight configuration in a single call.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the keyboard |
| enabled | boolean | No | Enable/disable backlight (default: true) |
| mode | string/number | No | Backlight mode (default: "automatic") |
| level | number | No | Brightness level (default: 5) |

```javascript
const result = await logitech_set_backlight({
    deviceName: "MX Keys S",
    enabled: true,
    mode: "manual",
    level: 8
});
// Returns: { success: true }
```

### logitech_set_backlight_durations(options)

Sets the timeout durations for when the backlight dims/turns off.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the keyboard |
| handsOut | number | No | Seconds until dim when hands are away (5-600) |
| handsIn | number | No | Seconds until dim when hands are nearby (5-600) |
| powered | number | No | Seconds until dim when on external power (5-600) |

```javascript
const result = await logitech_set_backlight_durations({
    deviceName: "MX Keys S",
    handsOut: 30,    // Dim after 30 seconds when hands away
    handsIn: 120,    // Dim after 2 minutes when hands nearby
    powered: 600     // Dim after 10 minutes on USB power
});
// Returns: { success: true }
```

**Example: Toggle backlight mode**

```javascript
async function toggleBacklightMode() {
    const deviceName = "MX Keys S";

    const state = await logitech_get_backlight_state({ deviceName });
    if (state.error) return `Error: ${state.error}`;

    // Toggle between automatic and manual
    const newMode = state.mode === "automatic" ? "manual" : "automatic";

    await logitech_set_backlight_mode({ deviceName, mode: newMode });
    return `Backlight mode: ${newMode}`;
}
```

**Example: Brightness control with display**

```javascript
async function setBacklightWithNotification(level) {
    const deviceName = "MX Keys S";

    // Get max level first
    const state = await logitech_get_backlight_state({ deviceName });
    if (state.error) return `Error: ${state.error}`;

    // Clamp level
    const clampedLevel = Math.max(0, Math.min(level, state.maxLevel));

    await logitech_set_backlight_level({ deviceName, level: clampedLevel });

    // Show notification
    await trigger_action({
        json: JSON.stringify({
            BTTPredefinedActionType: 309,
            BTTNotificationTitle: "Keyboard Backlight",
            BTTNotificationText: `Brightness: ${clampedLevel}/${state.maxLevel}`
        })
    });

    return `Backlight set to ${clampedLevel}`;
}
```

**Example: Dim backlight at night**

```javascript
async function autoBacklightForTime() {
    const deviceName = "MX Keys S";
    const hour = new Date().getHours();

    // Night mode: 10 PM - 6 AM
    const isNight = hour >= 22 || hour < 6;

    if (isNight) {
        // Low brightness, quick timeout
        await logitech_set_backlight({
            deviceName,
            enabled: true,
            mode: "manual",
            level: 2
        });
        await logitech_set_backlight_durations({
            deviceName,
            handsOut: 10,
            handsIn: 30,
            powered: 60
        });
        return "Night mode: low brightness";
    } else {
        // Automatic mode for daytime
        await logitech_set_backlight({
            deviceName,
            enabled: true,
            mode: "automatic"
        });
        return "Day mode: automatic brightness";
    }
}
```

### logitech_increase_backlight(options)

Simple helper to increase keyboard backlight by one level.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the keyboard. If omitted, applies to ALL keyboards with backlight support. |

```javascript
// Increase backlight on a specific keyboard
const result = await logitech_increase_backlight({ deviceName: "MX Keys S" });
// Returns: { success: true, level: 6, maxLevel: 10 }

// Increase backlight on ALL connected Logitech keyboards
const result2 = await logitech_increase_backlight({});
// Returns: { success: true, level: 6, maxLevel: 10 }
```

### logitech_decrease_backlight(options)

Simple helper to decrease keyboard backlight by one level.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the keyboard. If omitted, applies to ALL keyboards with backlight support. |

```javascript
// Decrease backlight on a specific keyboard
const result = await logitech_decrease_backlight({ deviceName: "MX Keys S" });
// Returns: { success: true, level: 4, maxLevel: 10 }

// Decrease backlight on ALL connected Logitech keyboards
const result2 = await logitech_decrease_backlight({});
// Returns: { success: true, level: 4, maxLevel: 10 }
```

---

## DPI Quick Adjustment

Simple helpers for adjusting mouse DPI with logarithmic scaling (feels natural across the entire DPI range).

### logitech_increase_dpi(options)

Increases mouse DPI by a percentage-based scale factor.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the mouse. If omitted, applies to ALL mice with DPI support. |
| scaleFactor | number | No | Multiplier for increase (default: 1.2 = 20% increase) |

```javascript
// Increase DPI by 20% (default) on a specific mouse
const result = await logitech_increase_dpi({ deviceName: "MX Master 3" });
// Returns: { success: true, dpi: 1920 }  // Was 1600, now 1920

// Increase DPI by 50% on a specific mouse
const result2 = await logitech_increase_dpi({ deviceName: "G502", scaleFactor: 1.5 });
// Returns: { success: true, dpi: 2400 }  // Was 1600, now 2400

// Increase DPI on ALL connected Logitech mice
const result3 = await logitech_increase_dpi({});
// Returns: { success: true, dpi: 1920 }  // Returns last mouse's new DPI
```

### logitech_decrease_dpi(options)

Decreases mouse DPI by a percentage-based scale factor.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the mouse. If omitted, applies to ALL mice with DPI support. |
| scaleFactor | number | No | Divisor for decrease (default: 1.2 = 20% decrease) |

```javascript
// Decrease DPI by 20% (default) on a specific mouse
const result = await logitech_decrease_dpi({ deviceName: "MX Master 3" });
// Returns: { success: true, dpi: 1333 }  // Was 1600, now ~1333

// Decrease DPI by 50% on a specific mouse
const result2 = await logitech_decrease_dpi({ deviceName: "G502", scaleFactor: 1.5 });
// Returns: { success: true, dpi: 1066 }  // Was 1600, now ~1066

// Decrease DPI on ALL connected Logitech mice
const result3 = await logitech_decrease_dpi({});
// Returns: { success: true, dpi: 1333 }  // Returns last mouse's new DPI
```

**Why logarithmic scaling?**

Percentage-based scaling feels more natural than fixed steps:
- At 800 DPI, a 20% increase adds 160 DPI (noticeable)
- At 6400 DPI, a 20% increase adds 1280 DPI (also noticeable)

Linear steps (e.g., +200 DPI) would feel huge at low DPI but barely perceptible at high DPI.

**Example: DPI adjustment hotkeys**

```javascript
// Bind to keyboard shortcut for quick DPI adjustment on ALL mice
async function dpiUp() {
    const result = await logitech_increase_dpi({});
    if (result.success) {
        return `DPI: ${result.dpi}`;
    }
    return `Error: ${result.error}`;
}

async function dpiDown() {
    const result = await logitech_decrease_dpi({});
    if (result.success) {
        return `DPI: ${result.dpi}`;
    }
    return `Error: ${result.error}`;
}
```

---

## Haptic Feedback

Trigger haptic feedback patterns on supported Logitech mice (MX Master 4, and other devices with haptic motors).

### logitech_trigger_haptic(options)

Triggers a haptic feedback pattern on the device's haptic motor.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | No | Name of the device. If omitted, applies to ALL devices with haptic support. |
| pattern | number | No | Haptic pattern ID (0-14, default: 0) |

**Available Patterns:**

| ID | Name | Description |
|----|------|-------------|
| 0 | Quick Click | Short, crisp tap |
| 1 | Soft Click | Gentle, muted tap |
| 2 | Strong Pulse | Bold, firm feedback |
| 3 | Gentle Pulse | Soft, cushioned feedback |
| 4 | Light Tap | Barely noticeable touch |
| 5 | Success | Positive confirmation |
| 6 | Warning | Error notification |
| 7 | Done | Task completion |
| 8 | Buzz | Sharp digital vibration |
| 9 | Smooth Wave | Flowing oscillation |
| 10 | Burst | Explosive pop |
| 11 | Urgent | Intense alert |
| 12 | Double Tap | Rhythmic knock |
| 13 | Chime | Melodic ring |
| 14 | Vibrate | Continuous ring |

```javascript
// Trigger default haptic pattern (Quick Click) on a specific mouse
const result = await logitech_trigger_haptic({ deviceName: "MX Master 4" });
// Returns: { success: true, pattern: 0 }

// Trigger "Success" pattern on a specific mouse
const result2 = await logitech_trigger_haptic({
    deviceName: "MX Master 4",
    pattern: 5
});
// Returns: { success: true, pattern: 5 }

// Trigger haptic on ALL mice with haptic support
const result3 = await logitech_trigger_haptic({ pattern: 7 });
// Returns: { success: true, pattern: 7 }
```

**Example: Haptic feedback for button press confirmation**

```javascript
async function confirmAction() {
    // Trigger "Done" pattern to confirm action completed
    const result = await logitech_trigger_haptic({
        deviceName: "MX Master 4",
        pattern: 7  // Done
    });

    if (result.error) {
        return `Error: ${result.error}`;
    }

    return "Action confirmed with haptic feedback";
}
```

**Example: Different haptic for success vs error**

```javascript
async function performTaskWithFeedback(taskSucceeded) {
    if (taskSucceeded) {
        // Success pattern
        await logitech_trigger_haptic({ pattern: 5 });
        return "Task completed!";
    } else {
        // Warning pattern
        await logitech_trigger_haptic({ pattern: 6 });
        return "Task failed!";
    }
}
```

---

## Utility Functions

### logitech_quick_setup(options)

Configures multiple device settings in a single call. Only provided settings will be changed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| dpi | number | No | DPI value to set |
| reportRate | number | No | Report rate in Hz |
| ledColor | array | No | RGB array [red, green, blue] |
| enableHostMode | boolean | No | Enable host control mode |
| remapButtonsToMouseButtons | boolean | No | Remap special buttons to standard mouse buttons |
| ratchet | boolean | No | Scroll wheel mode (true=ratchet, false=freespin) |
| autoDisengage | number | No | SmartShift auto-disengage threshold (0-50) |
| torque | number | No | SmartShift torque (1-100, Enhanced SmartShift only) |
| hiResScrollEnabled | boolean | No | Enable high-resolution scrolling |
| invertMainWheel | boolean | No | Invert main scroll wheel |
| invertThumbWheel | boolean | No | Invert thumb wheel |

```javascript
const result = await logitech_quick_setup({
    deviceName: "G502 HERO",
    dpi: 1600,
    reportRate: 1000,
    ledColor: [0, 128, 255],
    enableHostMode: true,
    remapButtonsToMouseButtons: true
});
// Returns: { success: true }
```

**Example: Complete mouse setup**

```javascript
async function setupMouse() {
    const result = await logitech_quick_setup({
        deviceName: "MX Master 3",
        dpi: 1600,
        enableHostMode: true,
        ratchet: false,          // Freespin mode
        autoDisengage: 10,
        hiResScrollEnabled: true,
        invertThumbWheel: true
    });

    return result.success ? "Mouse configured!" : `Error: ${result.error}`;
}
```

### logitech_remap_buttons_to_mouse(options)

Remaps device-specific buttons to standard mouse button events.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_remap_buttons_to_mouse({ deviceName: "G502 HERO" });
// Returns: { success: true }
```

### logitech_reset_to_factory_defaults(options)

Resets the device to factory default settings. The device will reboot.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |

```javascript
const result = await logitech_reset_to_factory_defaults({ deviceName: "G502 HERO" });
// Returns: { success: true, message: "Device reset to factory defaults. Device will reboot." }
```

### logitech_send_raw_request(options)

Sends a raw HID++ request to the device. For advanced users only.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| deviceName | string | Yes | Name of the device |
| featureId | number | Yes | HID++ feature ID (e.g., 0x8100) |
| functionId | number | Yes | Function ID within the feature |
| parameters | array | No | Array of parameter bytes |

```javascript
// Example: Read device name (Feature 0x0005, Function 0x00)
const result = await logitech_send_raw_request({
    deviceName: "G502 HERO",
    featureId: 0x0005,
    functionId: 0x00,
    parameters: [0]
});
// Returns: { success: true, response: [...] }
```

---

## Feature Cache Management

BetterTouchTool caches discovered HID++ features for faster device initialization. These functions help manage that cache.

### logitech_clear_feature_cache()

Clears the runtime feature cache for all devices. Useful if a device's features have changed or if you're troubleshooting detection issues.

```javascript
const result = await logitech_clear_feature_cache();
// Returns:
// {
//   success: true,
//   message: "Feature cache cleared. Reconnect your Logitech devices to re-discover features."
// }
```

**Note:** After clearing the cache, you should restart the Logitech manager or reconnect your devices for the changes to take effect.

### logitech_get_feature_cache_diagnostics()

Gets diagnostic information about the feature cache, including which devices are cached and their feature counts.

```javascript
const result = await logitech_get_feature_cache_diagnostics();
// Returns:
// {
//   success: true,
//   diagnostics: {
//     builtInDeviceCount: 0,
//     runtimeCacheCount: 2,
//     builtInDevices: [],
//     cachedDevices: ["046d:b034", "046d:c52b:slot1"]
//   }
// }
```

**Example: Troubleshooting device features**

```javascript
async function debugFeatureCache() {
    const diagnostics = await logitech_get_feature_cache_diagnostics();

    if (!diagnostics.success) {
        return `Error: ${diagnostics.error}`;
    }

    const info = diagnostics.diagnostics;
    let output = "Feature Cache Diagnostics:\n";
    output += `  Built-in profiles: ${info.builtInDeviceCount}\n`;
    output += `  Cached devices: ${info.runtimeCacheCount}\n`;

    if (info.cachedDevices.length > 0) {
        output += "  Cached device IDs:\n";
        for (const deviceId of info.cachedDevices) {
            output += `    - ${deviceId}\n`;
        }
    }

    return output;
}
```

---

## Receiver Pairing

### logitech_start_pairing(options)

Starts pairing mode on a Logitech receiver.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| timeout | number | No | Pairing timeout in seconds (default: 30) |

```javascript
const result = await logitech_start_pairing({ timeout: 60 });
// Returns: { success: true }
// Or: { error: "No Unifying or Bolt receivers detected" }
```

### logitech_stop_pairing()

Stops pairing mode on all receivers.

```javascript
const result = await logitech_stop_pairing();
// Returns: { success: true }
```

**Example: Pairing workflow**

```javascript
async function startPairing() {
    log("Starting pairing mode for 60 seconds...");
    log("Turn on your Logitech device now.");

    const result = await logitech_start_pairing({ timeout: 60 });

    if (result.error) {
        return `Pairing failed: ${result.error}`;
    }

    return "Pairing mode active. Turn on your device.";
}
```

---

## Error Handling

All functions return an object. On error, the object will contain an `error` property:

```javascript
async function safeGetDPI() {
    const deviceName = "G502 HERO";

    const result = await logitech_get_dpi({ deviceName });

    if (result.error) {
        log(`Error: ${result.error}`);
        return null;
    }

    return result.dpi;
}
```

**Common errors:**
- `"Missing required parameter: deviceName"` - Required parameter not provided
- `"Device not found"` - No device with that name is connected
- `"Feature not supported"` - Device doesn't support this feature
- `"Device not ready"` - Device is still initializing

---

## Complete Example: Mouse Control Panel

```javascript
async function mouseControlPanel() {
    const deviceName = "G502 HERO";

    // Get all device info
    const devices = await logitech_get_devices();
    const device = devices.devices.find(d => d.name === deviceName);

    if (!device) {
        return `Device "${deviceName}" not found`;
    }

    let info = `=== ${device.name} ===\n`;
    info += `Protocol: HID++ ${device.protocolVersion}\n\n`;

    // DPI
    if (device.features.supportsDPI) {
        const dpi = await logitech_get_dpi({ deviceName });
        const caps = await logitech_get_dpi_capabilities({ deviceName });
        info += `DPI: ${dpi.dpi}\n`;
        if (caps.sensors && caps.sensors[0]) {
            info += `  Range: ${caps.sensors[0].minDPI} - ${caps.sensors[0].maxDPI}\n`;
        }
    }

    // Report Rate
    if (device.features.supportsReportRate) {
        const rate = await logitech_get_report_rate({ deviceName });
        info += `Report Rate: ${rate.rateHz}Hz\n`;
    }

    // Battery
    if (device.features.supportsBattery) {
        const battery = await logitech_get_battery_status({ deviceName });
        info += `Battery: ${battery.level}% (${battery.status})\n`;
    }

    // Profile
    if (device.features.supportsProfiles) {
        const mode = await logitech_get_mode({ deviceName });
        const profile = await logitech_get_active_profile({ deviceName });
        info += `Mode: ${mode.mode}\n`;
        info += `Active Profile: ${profile.profileIndex + 1}\n`;
    }

    return info;
}
```
