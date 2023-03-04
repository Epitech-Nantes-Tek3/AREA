# Terraform

## Why should I use it ?
You should use this terraform configuration to deploy this area project on Azure.
The objective is to have a server and a web app deploy on azure and able to connect over internet.

## How to use ?
Terraform is simple to use. There are only two steps to deploy the infrastructure.

### Pre-requirement
Move to the terraform folder using: `cd terraform`

### Connect to azure
On first step, you must connect to your azure account. To perform this action, run the command ```az login```. A tab on your browser will appear. Select your microsoft account, close the page, done!

### Run terraform
The second and last step is to use terraform. To perform this step, you have to run 2 commands:
- `terraform init` (It prepares your folder to perform the next command)
- `terraform apply` (Which create the infrastructure on Azure)

___

That all, your infrastructure is deployed on azure!
You can find server and web IP in a file named `IPS.json` at root.