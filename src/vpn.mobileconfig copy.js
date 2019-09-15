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
   <key>PayloadCertificateFileName</key>
   <string>ca.pem</string>
   <key>PayloadContent</key>
   <data>
${vpn.caCertificate}
   </data>
   <key>PayloadDescription</key>
   <string>Root Certificate Authority</string>
   <key>PayloadDisplayName</key>
   <string>strongSwan Root CA</string>
   <key>PayloadIdentifier</key>
   <string>com.apple.security.pem.${uuid2}</string>
   <key>PayloadType</key>
   <string>com.apple.security.pem</string>
   <key>PayloadUUID</key>
   <string>${uuid2}</string>
   <key>PayloadVersion</key>
   <integer>1</integer>
  </dict>
  <dict>
   <key>PayloadCertificateFileName</key>
   <string>server.pem</string>
   <key>PayloadContent</key>
   <data>
${vpn.serverCertificate}
   </data>
   <key>PayloadDescription</key>
   <string>PKCS#1</string>
   <key>PayloadDisplayName</key>
   <string>${vpn.ipAddress}</string>
   <key>PayloadIdentifier</key>
   <string>com.apple.security.pem.${uuid5}</string>
   <key>PayloadType</key>
   <string>com.apple.security.pem</string>
   <key>PayloadUUID</key>
   <string>${uuid5}</string>
   <key>PayloadVersion</key>
   <integer>1</integer>
  </dict>
  <dict>
   <key>Password</key>
   <string>${vpn.privateKeyPassword}</string>
   <key>PayloadCertificateFileName</key>
   <string>client.cert.p12</string>
   <key>PayloadContent</key>
   <data>
${vpn.privateKeyCertificate}
   </data>
   <key>PayloadDescription</key>
   <string>PKCS#12</string>
   <key>PayloadDisplayName</key>
   <string>strongSwan Client Certificate</string>
   <key>PayloadIdentifier</key>
   <string>com.apple.security.pkcs12.${uuid1}</string>
   <key>PayloadType</key>
   <string>com.apple.security.pkcs12</string>
   <key>PayloadUUID</key>
   <string>${uuid1}</string>
   <key>PayloadVersion</key>
   <integer>1</integer>
  </dict>
  <dict>
   <key>IKEv2</key>
   <dict>
    <key>AuthenticationMethod</key>
    <string>Certificate</string>
    <key>ChildSecurityAssociationParameters</key>
    <dict>
     <key>DiffieHellmanGroup</key>
     <integer>19</integer>
     <key>EncryptionAlgorithm</key>
     <string>AES-128-GCM</string>
     <key>IntegrityAlgorithm</key>
     <string>SHA2-512</string>
     <key>LifeTimeInMinutes</key>
     <integer>20</integer>
    </dict>
    <key>DeadPeerDetectionRate</key>
    <string>Medium</string>
    <key>DisableMOBIKE</key>
    <integer>0</integer>
    <key>DisableRedirect</key>
    <integer>1</integer>
    <key>EnableCertificateRevocationCheck</key>
    <integer>0</integer>
    <key>EnablePFS</key>
    <true/>
    <key>IKESecurityAssociationParameters</key>
    <dict>
     <key>DiffieHellmanGroup</key>
     <integer>19</integer>
     <key>EncryptionAlgorithm</key>
     <string>AES-128-GCM</string>
     <key>IntegrityAlgorithm</key>
     <string>SHA2-512</string>
     <key>LifeTimeInMinutes</key>
     <integer>20</integer>
    </dict>
    <key>LocalIdentifier</key>
    <string>${vpn.ipAddress}</string>
    <key>PayloadCertificateUUID</key>
    <string>${uuid1}</string>
    <key>CertificateType</key>
    <string>ECDSA256</string>
    <key>ServerCertificateIssuerCommonName</key>
    <string>${vpn.ipAddress}</string>
    <key>RemoteAddress</key>
    <string>${vpn.ipAddress}</string>
    <key>RemoteIdentifier</key>
    <string>${vpn.ipAddress}</string>
    <key>UseConfigurationAttributeInternalIPSubnet</key>
    <integer>0</integer>
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