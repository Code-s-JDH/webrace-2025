terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "Glebegor-org"
    workspaces {
      name = "webrace"
    }
  }
}

resource "digitalocean_database_cluster" "postgres_db" {
  name       = var.database_name
  engine     = "pg"
  version    = "17"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
  tags       = [var.project_name]
}

resource "digitalocean_database_user" "db_user" {
  cluster_id = digitalocean_database_cluster.postgres_db.id
  name       = var.database_username
}

resource "digitalocean_container_registry" "my_registry" {
  name                   = var.docker_registry_name
  subscription_tier_slug = "basic"
  region                 = var.region
}

resource "digitalocean_container_registry_docker_credentials" "registry_credentials" {
  registry_name = digitalocean_container_registry.my_registry.name
  write         = true
  depends_on    = [digitalocean_container_registry.my_registry]
}

resource "digitalocean_kubernetes_cluster" "my_cluster" {
  name    = var.cluster_name
  region  = var.region
  version = "1.32.2-do.0"
  tags    = [var.project_name]

  registry_integration = true

  node_pool {
    name       = var.node_pool_name
    size       = var.node_size
    node_count = 2
    tags       = [var.project_name]
  }
}

provider "kubernetes" {
  host  = digitalocean_kubernetes_cluster.my_cluster.endpoint
  token = digitalocean_kubernetes_cluster.my_cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(
    digitalocean_kubernetes_cluster.my_cluster.kube_config[0].cluster_ca_certificate
  )
}

resource "kubernetes_secret" "registry_secret" {
  metadata {
    name = "do-registry-secret"
  }
  data = {
    ".dockerconfigjson" = <<DOCKERCONFIG
{
  "auths": {
    "${digitalocean_container_registry.my_registry.server_url}": {
      "auth": "${base64encode("${digitalocean_container_registry_docker_credentials.registry_credentials.docker_credentials}")}"
    }
  }
}
DOCKERCONFIG
  }
  type = "kubernetes.io/dockerconfigjson"
}

output "database_uri" {
  value     = digitalocean_database_cluster.postgres_db.uri
  sensitive = true
}

output "db_user_password" {
  value     = digitalocean_database_user.db_user.password
  sensitive = true
}

output "kubeconfig" {
  value     = digitalocean_kubernetes_cluster.my_cluster.kube_config[0].raw_config
  sensitive = true
}

output "registry_endpoint" {
  value = digitalocean_container_registry.my_registry.server_url
}