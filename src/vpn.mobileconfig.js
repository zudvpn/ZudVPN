import uuidv4 from 'uuid/v4'

export default (name, vpn) => {
   const uuid1 = uuidv4()
   const uuid2 = uuidv4()
   const uuid4 = uuidv4()
   const uuid5 = uuidv4()
   const uuid6 = uuidv4()

   return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
 <key>PayloadDescription</key>
 <string>VPN Configuration Profile</string>
 <key>PayloadDisplayName</key>
 <string>${name}</string>
 <key>PayloadIdentifier</key>
 <string>com.zudvpn.${name}</string>
 <key>PayloadRemovalDisallowed</key>
 <false/>
 <key>PayloadType</key>
 <string>Configuration</string>
 <key>PayloadUUID</key>
 <string>${uuid6}</string>
 <key>PayloadVersion</key>
 <integer>1</integer>
 <key>PayloadContent</key>
 <array>
  <dict>
   <key>IKEv2</key>
   <dict>
    <key>AuthenticationMethod</key>
    <string>None</string>
    <key>ExtendedAuthEnabled</key>
    <true/>
    <key>AuthName</key>
    <string>vpn</string>
    <key>AuthPassword</key>
    <string>${vpn.password}</string>    
    <key>LocalIdentifier</key>
    <string>${vpn.ipAddress}</string>
    <key>RemoteAddress</key>
    <string>${vpn.ipAddress}</string>
    <key>RemoteIdentifier</key>
    <string>${vpn.ipAddress}</string>
   </dict>
   <key>IPv4</key>
   <dict>
    <key>OverridePrimary</key>
    <integer>1</integer>
   </dict>
   <key>PayloadDescription</key>
   <string>Configures VPN settings</string>
   <key>PayloadDisplayName</key>
   <string>${name}</string>
   <key>PayloadIdentifier</key>
   <string>com.apple.vpn.managed.${uuid4}</string>
   <key>PayloadType</key>
   <string>com.apple.vpn.managed</string>
   <key>PayloadUUID</key>
   <string>${uuid4}</string>
   <key>PayloadVersion</key>
   <real>1</real>
   <key>Proxies</key>
   <dict>
    <key>HTTPEnable</key>
    <integer>0</integer>
    <key>HTTPSEnable</key>
    <integer>0</integer>
   </dict>
   <key>UserDefinedName</key>
   <string>${name}</string>
   <key>VPNType</key>
   <string>IKEv2</string>
  </dict>
 </array>
</dict>
</plist>`
}