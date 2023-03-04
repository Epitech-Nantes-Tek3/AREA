# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  required_version = ">= 1.1.5"
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

resource "azurerm_resource_group" "rg" {
  name     = "myTFResourceGroup"
  location = "westeurope"
}

resource "azurerm_container_registry" "acr" {
  name                = "areacontainerregistry2"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "westeurope"
  sku                 = "Standard"
  admin_enabled       = true
}

resource "null_resource" "push_server_image" {
  provisioner "local-exec" {
    command = "az acr build --registry areacontainerregistry2 --image area_server:latest --file ../Server/Dockerfile ../Server"
  }
  depends_on = [azurerm_container_registry.acr]
}

resource "azurerm_container_group" "area_server" {
  name                = "area-server"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  os_type             = "Linux"

  container {
    name   = "area-server"
    image  = "areacontainerregistry2.azurecr.io/area_server:latest"
    cpu    = "1"
    memory = "1.5"
    ports {
      port     = 8080
      protocol = "TCP"
    }
  }
  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
  depends_on = [null_resource.push_server_image]
}

resource "local_file" "web_server_ip" {
  content = templatefile("serverIP.tpl",
    {
      SERVER_INSTANCE_IP = azurerm_container_group.area_server.ip_address
    }
  )
  filename = "../Web/src/serverIP.js"
}

resource "local_file" "app_server_ip" {
  content = templatefile("serverIP.tpl",
    {
      SERVER_INSTANCE_IP = azurerm_container_group.area_server.ip_address
    }
  )
  filename = "../Application/serverIP.ts"
}
