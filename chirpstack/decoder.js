/*
 Thingsat project

 Javascript codec functions for LR-FHSS Field Test Device endpoints
 Copyright (c) 2024 UGA CSUG LIG

 Unless required by applicable law or agreed to in writing, this
 software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 CONDITIONS OF ANY KIND, either express or implied.
 */

/*
 * Author: Didier Donsez, Florent Dobler, Université Grenoble Alpes
 */

function readUInt16BE(buf, offset) {
    offset = offset >>> 0;
    return (buf[offset] << 8) | buf[offset + 1];
}

function readUInt32BE(buf, offset) {
    offset = offset >>> 0;

    return (buf[offset] * 0x1000000) +
        ((buf[offset + 1] << 16) |
            (buf[offset + 2] << 8) |
            buf[offset + 3]);
}

function readUInt8(buf, offset) {
    offset = offset >>> 0;
    return (buf[offset]);
}

function readInt8(buf, offset) {
    offset = offset >>> 0;
    if (!(buf[offset] & 0x80)) return (buf[offset]);
    return ((0xff - buf[offset] + 1) * -1);
}

function Decode(fPort, bytes, variables) {

    var o = {};

    switch (fPort) {
        case 202: {
            // TODO App Clock Sync (managed at LNS level)
            break;
        }
        default: {
            var size = bytes.length;
            o.size = size;

            o.benchmark_id = fPort;

            var idx = 0
            if (idx + 2 > size) { return o; }

            // Extract LoRa settings.
            o.txpower = readUInt8(bytes, idx);
            idx++;
            o.dataRate = readUInt8(bytes, idx);
            idx++;

            if (idx + 2 > size) { return o; }
            // Extract temperature.
            o.temperature = readUInt16BE(bytes, idx) / 100.0;
            idx += 2;

            if (idx + 8 > size) { return o; }

            // Value used for the conversion of the position from DMS to decimal.
            var MaxNorthPosition = 8388607; // 2^23 - 1
            var MaxEastPosition = 8388607; // 2^23 - 1

            // Extract latitude.
            var Latitude = (readUInt32BE(bytes, idx) >> 8) & 0x7FFF;
            Latitude = Latitude * 90 / MaxNorthPosition;
            o.latitude = Math.round(Latitude * 1000000) / 1000000;
            idx += 3;

            // Extract longitude.
            var Longitude = (readUInt32BE(bytes, idx) >> 8);
            Longitude = Longitude * 180 / MaxEastPosition;
            o.longitude = Math.round(Longitude * 1000000) / 1000000;
            idx += 3;

            // Extract altitude.
            o.altitude = readUInt16BE(bytes, idx);
            idx += 2;

            // TODO Extract last downlink <fCnt,RSSI,SNR>
            // Extract altitude.
            if (idx + 4 > size) { return o; }

            o.dn_fcnt = readUInt16BE(bytes, idx);
            idx += 2;
            o.dn_rssi = readUInt8(bytes, idx) * -1;
            idx += 1;
            o.dn_snr = readInt8(bytes, idx) / 5.0;
            idx += 1;
        }
    }
    return o;
}

// Decode uplink function.
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.
function decodeUplink(input) {
    return {
        data: Decode(input.fPort, input.bytes, null),
        warnings: [],
        errors: []
    };
}

// Encode downlink function.
//
// Input is an object with the following fields:
// - data = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.
function encodeDownlink(input) {

    // TODO [ ] change TX pattern sequence
    // TODO [ ] change TX period
    // TODO [ ] reboot

    return {
        bytes: [225, 230, 255, 0]
    };
}