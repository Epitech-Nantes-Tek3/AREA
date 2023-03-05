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

resource "azurerm_resource_group" "area_resource_group" {
  name     = "area_resource_group"
  location = "westeurope"
}

resource "azurerm_container_registry" "area_container_registry" {
  name                = "myareacontainerregistry"
  resource_group_name = azurerm_resource_group.area_resource_group.name
  location            = "westeurope"
  sku                 = "Standard"
  admin_enabled       = true
}

resource "null_resource" "push_server_image" {
  provisioner "local-exec" {
    command = "az acr build --registry myareacontainerregistry --image area_server:latest --file ../Server/Dockerfile ../Server"
  }
  depends_on = [azurerm_container_registry.area_container_registry]
}

resource "null_resource" "push_web_image" {
  provisioner "local-exec" {
    command = "az acr build --registry myareacontainerregistry --image area_client_web:latest --file ../Web/Dockerfile.azure ../Web"
  }
  depends_on = [azurerm_container_registry.area_container_registry]
}

resource "azurerm_container_group" "area_web" {
  name                = "area-web"
  location            = azurerm_resource_group.area_resource_group.location
  resource_group_name = azurerm_resource_group.area_resource_group.name
  ip_address_type     = "Public"
  os_type             = "Linux"

  container {
    name   = "area-web"
    image  = "myareacontainerregistry.azurecr.io/area_client_web:latest"
    cpu    = "1"
    memory = "1.5"
    ports {
      port     = 80
      protocol = "TCP"
    }
  }
  image_registry_credential {
    server   = azurerm_container_registry.area_container_registry.login_server
    username = azurerm_container_registry.area_container_registry.admin_username
    password = azurerm_container_registry.area_container_registry.admin_password
  }
  depends_on = [null_resource.push_web_image, local_file.web_server_ip]
}

resource "azurerm_container_group" "area_server" {
  name                = "area-server"
  location            = azurerm_resource_group.area_resource_group.location
  resource_group_name = azurerm_resource_group.area_resource_group.name
  ip_address_type     = "Public"
  os_type             = "Linux"

  container {
    name   = "area-server"
    image  = "myareacontainerregistry.azurecr.io/area_server:latest"
    cpu    = "1"
    memory = "1.5"
    ports {
      port     = 8080
      protocol = "TCP"
    }
  }
  image_registry_credential {
    server   = azurerm_container_registry.area_container_registry.login_server
    username = azurerm_container_registry.area_container_registry.admin_username
    password = azurerm_container_registry.area_container_registry.admin_password
  }
  depends_on = [null_resource.push_server_image]
}

resource "azurerm_cdn_profile" "area_cdn_profile" {
  name                = "area-cdn-profile"
  location            = azurerm_resource_group.area_resource_group.location
  resource_group_name = azurerm_resource_group.area_resource_group.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "area_cdn_endpoint" {
  name                = "area-web-nantes-x-strasbourg"
  profile_name        = azurerm_cdn_profile.area_cdn_profile.name
  location            = azurerm_resource_group.area_resource_group.location
  resource_group_name = azurerm_resource_group.area_resource_group.name
  origin_host_header  = azurerm_container_group.area_web.ip_address
  is_http_allowed     = true
  is_https_allowed    = false

  origin {
    name      = "area-web"
    host_name = azurerm_container_group.area_web.ip_address
  }
}

resource "azurerm_cdn_endpoint" "area_cdn_endpoint2" {
  name                = "area-server-nantes-x-strasbourg"
  profile_name        = azurerm_cdn_profile.area_cdn_profile.name
  location            = azurerm_resource_group.area_resource_group.location
  resource_group_name = azurerm_resource_group.area_resource_group.name
  origin_host_header  = azurerm_container_group.area_server.ip_address
  is_http_allowed     = true
  is_https_allowed    = false

  origin {
    name      = "area-server"
    host_name = azurerm_container_group.area_server.ip_address
  }
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

resource "local_file" "write_ips" {
  content = templatefile("writeIPs.tpl",
    {
      WEB_INSTANCE_IP = azurerm_container_group.area_web.ip_address
      SERVER_INSTANCE_IP = azurerm_container_group.area_server.ip_address
    }
  )
  filename = "../IPS.json"
}