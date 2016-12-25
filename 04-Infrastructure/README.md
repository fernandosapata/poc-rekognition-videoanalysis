Project - Infrastructure
---

The main goal of this document is to outline all infrastructure rules and access we got for this project. Anything which has been created,updated,deleted must be added in this document.

### Network:

+ VPC: 
+ Subnet: 
+ Public IP:  
+ Public DNS: 

### SSH Access:

+ PEM file: <yourpemfile.pem> 
+ Execute on your Terminal Application 

        cp <yourpemfile.pem> ~/.ssh/  
        chmod 400 ~/.ssh/<yourpemfile.pem>
        ssh -i ~/.ssh/<yourpemfile.pem> <yourUser>@<yourPublicIP>

