Project - Certificates
---

### Apple - Sandbox - Development:

+ Private Key filename: aps_development_privatekey.p12
+ Private Key password: YourPassword
+ Exporting certificates in order to work with Amazon SNS

        #Export you private key to aps_development_privatekey.p12 using KeyChain Access
   
        #Generate pem files
        openssl x509 -in aps_development.cer -inform DER -out aps_development.pem
        openssl pkcs12 -in aps_development_privatekey.p12 -out aps_development_privatekey.pem -nodes -clcerts

        #Check if they are working fine
        openssl s_client -connect gateway.sandbox.push.apple.com:2195 -cert aps_development.pem -key aps_development_privatekey.pem 
        
        #The console output must be something akin to it
        
        CONNECTED(00000003)
        depth=1 C = US, O = "Entrust, Inc.", OU = www.entrust.net/rpa is incorporated by reference, OU = "(c) 2009 Entrust, Inc.", CN = Entrust Certification Authority - L1C
        verify error:num=20:unable to get local issuer certificate
        verify return:0
        ---
        Certificate chain
         0 s:/C=US/ST=California/L=Cupertino/O=Apple Inc./OU=iTMS Engineering/CN=gateway.sandbox.push.apple.com
           i:/C=US/O=Entrust, Inc./OU=www.entrust.net/rpa is incorporated by reference/OU=(c) 2009 Entrust, Inc./CN=Entrust Certification Authority - L1C
         1 s:/C=US/O=Entrust, Inc./OU=www.entrust.net/rpa is incorporated by reference/OU=(c) 2009 Entrust, Inc./CN=Entrust Certification Authority - L1C
           i:/O=Entrust.net/OU=www.entrust.net/CPS_2048 incorp. by ref. (limits liab.)/OU=(c) 1999 Entrust.net Limited/CN=Entrust.net Certification Authority (2048)
        ---
        Server certificate
        -----BEGIN CERTIFICATE-----
        MIIFGzCCBAOgAwIBAgIETBz90jANBgkqhkiG9w0BAQUFADCBsTELMAkGA1UEBhMC
        VVMxFjAUBgNVBAoTDUVudHJ1c3QsIEluYy4xOTA3BgNVBAsTMHd3dy5lbnRydXN0
        Lm5ldC9ycGEgaXMgaW5jb3Jwb3JhdGVkIGJ5IHJlZmVyZW5jZTEfMB0GA1UECxMW
       .........


### Apple - Production:

+ Private Key filename: aps_production_privatekey.p12
+ Private Key password: YourPassword
+ Exporting certificates in order to work with Amazon SNS

        #Export you private key to aps_production_privatekey.p12 using KeyChain Access
   
        #Generate pem files
        openssl x509 -in aps_production.cer -inform DER -out aps_production.pem
        openssl pkcs12 -in aps_production_privatekey.p12 -out aps_production_privatekey.pem -nodes -clcerts

        #Check if they are working fine
        openssl s_client -connect gateway.push.apple.com:2195 -cert aps_production.pem -key aps_production_privatekey.pem 
        
        #The console output must be something akin to it
        
        CONNECTED(00000003)
        depth=1 C = US, O = "Entrust, Inc.", OU = www.entrust.net/rpa is incorporated by reference, OU = "(c) 2009 Entrust, Inc.", CN = Entrust Certification Authority - L1C
        verify error:num=20:unable to get local issuer certificate
        verify return:0
        ---
        Certificate chain
         0 s:/C=US/ST=California/L=Cupertino/O=Apple Inc./OU=iTMS Engineering/CN=gateway.sandbox.push.apple.com
           i:/C=US/O=Entrust, Inc./OU=www.entrust.net/rpa is incorporated by reference/OU=(c) 2009 Entrust, Inc./CN=Entrust Certification Authority - L1C
         1 s:/C=US/O=Entrust, Inc./OU=www.entrust.net/rpa is incorporated by reference/OU=(c) 2009 Entrust, Inc./CN=Entrust Certification Authority - L1C
           i:/O=Entrust.net/OU=www.entrust.net/CPS_2048 incorp. by ref. (limits liab.)/OU=(c) 1999 Entrust.net Limited/CN=Entrust.net Certification Authority (2048)
        ---
        Server certificate
        -----BEGIN CERTIFICATE-----
        MIIFGzCCBAOgAwIBAgIETBz90jANBgkqhkiG9w0BAQUFADCBsTELMAkGA1UEBhMC
        VVMxFjAUBgNVBAoTDUVudHJ1c3QsIEluYy4xOTA3BgNVBAsTMHd3dy5lbnRydXN0
        Lm5ldC9ycGEgaXMgaW5jb3Jwb3JhdGVkIGJ5IHJlZmVyZW5jZTEfMB0GA1UECxMW
       .........
