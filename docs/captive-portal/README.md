# Stack Consulting AI — Guest WiFi Captive Portal

Branded captive portal for the "Stack Consulting Guest" SSID. UniFi APs serve the splash page, guest enters email + accepts terms, email lands in Beehiiv via `/api/wifi-signup`, UniFi authorizes the device for 4 hours.

## Files
- `splash.html` — branded UniFi Hotspot landing page (email capture + T&C)
- `README.md` — this file (deploy + config notes)

## Architecture
```
Guest device → SSID "Stack Consulting Guest" (VLAN 50)
   → DHCP from pfSense (172.16.50.0/24)
   → UniFi AP intercepts HTTP, redirects to splash.html
   → Guest enters email + accepts T&C
   → JS POSTs email to https://stackconsultingai.com/api/wifi-signup (CORS)
   → Form natively submits to UniFi auth endpoint
   → UniFi authorizes MAC for 4h, releases device to internet
   → pfSense firewall: GUEST → !RFC1918 only (no LAN access)
```

## pfSense — VLAN + Firewall

### 1. Create VLAN 50
**Interfaces → VLANs → Add**
- Parent: `igc2` (LAN trunk to FS-switch — verify which iface carries APs)
- VLAN tag: `50`
- Description: `GUEST`

### 2. Assign interface
**Interfaces → Assignments → Add → VLAN 50**
- Enable, rename to `GUEST`
- IPv4: Static `172.16.50.1/24`
- Description: `Guest WiFi`

### 3. DHCP server
**Services → DHCP Server → GUEST**
- Range: `172.16.50.10 – 172.16.50.200`
- Default lease: `7200s` (2h), max `14400s` (4h)
- DNS servers: `172.16.50.1` (or `1.1.1.1, 1.0.0.1` for split-DNS)
- Domain: `guest.stack.lan`

### 4. Firewall rules on GUEST tab
Order matters — top-down:
```
1. PASS  GUEST net → GUEST address  port 53 (DNS), 67-68 (DHCP), 80, 443
2. BLOCK GUEST net → RFC1918 (172.16.0.0/12, 10.0.0.0/8, 192.168.0.0/16)
3. PASS  GUEST net → any           port 80, 443 (TCP) + DNS UDP
4. BLOCK GUEST net → any           (default deny)
```

## UniFi — Network + WLAN

UniFi controller: **172.16.23.10** (see `reference_unifi_controller.md`)

### 1. Network (VLAN 50)
**Settings → Networks → New Virtual Network**
- Name: `Stack Guest`
- VLAN: `50`
- Network Type: `VLAN Only` (pfSense handles DHCP/routing, NOT UniFi)
- Auto-scale Network: OFF

### 2. WLAN (SSID)
**Settings → WiFi → Create New WiFi Network**
- Name: `Stack Consulting Guest`
- Password: NONE (open) OR WPA2 with shared key — open is standard for guest portal
- Network: `Stack Guest` (the VLAN 50 network just made)
- Band Steering: OFF (guest devices may be old)
- Hotspot 2.0: ON
- **Advanced → Guest Hotspot: ENABLE**

### 3. Switch ports
Confirm AP uplink ports tag VLAN 50:
- FS-switch ports feeding APs: tagged VLAN 50, untagged native LAN
- If APs uplink via Netgear: same trunk config

## UniFi — Hotspot Portal

**Settings → Insights → Hotspot Manager → Landing Page**

### Authentication method
Choose: `Simple Password` OR `External Portal Server`

For email-gated splash: use built-in `Hotspot Manager → Landing Page → Customization`:
1. Toggle "Customize landing page" ON
2. Upload custom HTML — paste contents of `splash.html`
3. UniFi will template-substitute `$id $ap $ssid $t $url $action` placeholders
4. Set session length: `240` minutes (4h)
5. Show terms: ON (already embedded in HTML)
6. Save

Alternative (cleaner): **External Portal Server** mode — UniFi redirects guests to `https://stackconsultingai.com/wifi` and authorizes via UniFi API. Requires server-side UniFi API integration in Next app. Not implemented yet.

## Beehiiv — env vars

Already wired (shared with newsletter route):
- `BEEHIIV_API_KEY` — Vercel env
- `BEEHIIV_PUBLICATION_ID` — Vercel env

Optional new env: `BEEHIIV_WIFI_TAG` if we want a separate tag for portal signups (Beehiiv custom_fields are sent in the POST already).

## Testing

1. Connect a phone to `Stack Consulting Guest` SSID
2. Browser auto-pops captive portal (or visit any HTTP page)
3. Enter email, tick terms, tap Connect
4. Check Beehiiv dashboard → Subscriptions → filter by `utm_source = wifi_captive_portal`
5. Verify pfSense `Diagnostics → ARP Table` shows client MAC in 172.16.50.x
6. Verify device can browse internet but cannot ping 172.16.23.x

## Hardening
- [ ] Rate-limit `/api/wifi-signup` (Vercel edge limit or Upstash) — captive portals get scanned
- [ ] Add reCAPTCHA v3 invisible if abuse appears
- [ ] Switch to External Portal Server mode for full server-side control
- [ ] Add daily Slack notification: new subscribers from WiFi portal (via Resend or webhook)
