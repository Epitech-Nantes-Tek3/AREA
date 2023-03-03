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
  features {}
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

# resource "azurerm_container_group" "areaserver" {
#   name = "areaserver"
#   location = "westeurope"
#   resource_group_name = azurerm_resource_group.rg.name

#   container {
#     name = "area-server-container"
#     image = "areacontainerregistry2.azurecr.io/area_server:latest"
#     cpu = "1"
#     memory = "1.5"
#     ports {
#       port = 8080
#       protocol = "TCP"
#     }
#   }
#   # define credentials for the container registry
#   image_registry_credential {
#     server = azurerm_container_registry.acr.login_server
#     username = azurerm_container_registry.acr.admin_username
#     password = azurerm_container_registry.acr.admin_password
#   }
#   ip_address_type = "Public"
#   os_type = "Linux"
# }

# resource "azurerm_container_group" "areaweb" {
#   name = "areaweb"
#   location = "westeurope"
#   resource_group_name = azurerm_resource_group.rg.name

#   container {
#     name = "area-web-container"
#     image = "areacontainerregistry2.azurecr.io/area_web:latest"
#     cpu = "1"
#     memory = "1.5"
#     ports {
#       port = 3000
#       protocol = "TCP"
#     }
#   }
#   exposed_port {
#     port = 3000
#     protocol = "TCP"
#   }
#   image_registry_credential {
#     server = azurerm_container_registry.acr.login_server
#     username = azurerm_container_registry.acr.admin_username
#     password = azurerm_container_registry.acr.admin_password
#   }
#   ip_address_type = "Public"
#   os_type = "Linux"
# }
