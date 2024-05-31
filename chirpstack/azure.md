# Creation of a virtual machine on Microsoft Azure

## Preinstall

### Azure CLI
MacOS
```bash
brew update && brew install azure-cli
```

## Create VM

Generate a keys pair into `~/.ssh/azure` and `~/.ssh/azure.pub`
```bash
cd ~/.ssh
ssh-keygen -m PEM -t rsa -b 4096 -C chirpstack@azure
```

Deploy Ubuntu VM for [console](https://portal.azure.com) or with [Azure CLI](https://learn.microsoft.com/fr-fr/cli/azure/azure-cli-learn-bash) 

* Ubuntu 22.04 LTS
* 1CPU, 1GB RAM, 30 GB SSD 
* Allow port 22, 80, 443

Connection with SSH key (RSA 4096 not ED25519) --> ~/.ssh/azure

User: `lns`


## Add Ports to Networking

    Go to the Azure portal and navigate to the virtual machine or virtual network you want to open the port for.
    Click on the "Networking" section.
    Click on "Add inbound port rule" to create a new rule for the port you want to open.

* UDP 1700 Packet forwarder
* TCP 3001 Gateway Bridge
* TCP 8080 Console (unsecure)
* TCP 1883 MQTT (unsecure)
* TCP 8883 MQTT

## Add DN to public IP address

    Select your VM in the portal.
    In the left menu, select Properties.
    Under Public IP address\DNS name label, select your IP address.
    Under DNS name label, enter the prefix you want to use.
    Select Save at the top of the page.

`lns-lrfhss` on `northeurope.cloudapp.azure.com`


```bash
ssh -i ~/.ssh/azure slicesfr@52.158.12.234
ssh -i ~/.ssh/azure slicesfr@lns-lrfhss.northeurope.cloudapp.azure.com
```

## Azure CLI

Install on MacOS
```bash
brew update && brew install azure-cli
```


https://learn.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-cli
```bash
resourcegroup="LNS-LRFHSS_group"
location="northeurope"
az group create --name $resourcegroup --location $location

az vm list-sizes --location $location -o table
az vm list-skus --location $location --zone --size $size -o table
az vm list-usage --location $location -o table

vmname="LNS-LRFHSS"
username="slicesfr"
image=Ubuntu2204
size=Standard_B1s
az vm create --resource-group $resourcegroup --name $vmname \
    --image $image --public-ip-sku Standard --admin-username $username \
    --size $size \
    --nsg-rule SSH \
    --authentication-type ssh \
    --ssh-key-values @key-file \
    --os-type linux \

az vm wait  --resource-group $resourcegroup --name $vmname--created

az vm open-port --port 22 --resource-group $resourcegroup --name $vmname
az vm open-port --port 80 --resource-group $resourcegroup --name $vmname
az vm open-port --port 443 --resource-group $resourcegroup --name $vmname
az vm open-port --port 8080 --resource-group $resourcegroup --name $vmname
az vm open-port --port 1700 --resource-group $resourcegroup --name $vmname
az vm open-port --port 1883 --resource-group $resourcegroup --name $vmname
az vm open-port --port 8883 --resource-group $resourcegroup --name $vmname
az vm open-port --port 2101 --resource-group $resourcegroup --name $vmname

# az group delete --name $resourcegroup

```


```bash
az config set core.enable_broker_on_windows=true
az account clear
az login 
az account list
az consumption usage list --end-date 2024-05-09 --start-date 2024-05-01

az resource list | jq .
az resource list --query "[?type=='Microsoft.Compute/virtualMachines']"



az vm list -d -o table
az vm list -d -o table --query "[?name=='LNS-LRFHSS']"

az vm get-instance-view -o table --query "[?name=='LNS-LRFHSS']"

az vm start -g LNS-LRFHSS_GROUP_05051138 -n LNS-LRFHSS
# You can start all VMs in a resource group with the command below.
# az vm start --ids $(az vm list -g LNS-LRFHSS_GROUP_05051138 --query "[].id" -o tsv)

# Restart a VM
az vm restart -g LNS-LRFHSS_GROUP_05051138 -n LNS-LRFHSS

#  Stop a VM
# About to power off the specified VM... It will continue to be billed. To deallocate a VM, run: az vm deallocate.
az vm stop -g LNS-LRFHSS_GROUP_05051138 -n LNS-LRFHSS

az vm deallocate -g LNS-LRFHSS_GROUP_05051138 -n LNS-LRFHSS
```

