variable "do_token" {
    description = "The secret key for the application"
    type        = string
}
variable "region" {
    description = "The region to deploy the application"
    type        = string
    default     = "fra1"
}
variable "cluster_name" {
    description = "The name of the cluster"
    type        = string
    default     = "web-race-k8s-cluster"
}
variable "node_size" {
    description = "The size of the nodes"
    type        = string
    default     = "s-2vcpu-2gb"
}
variable "node_pool_name" {
    description = "The name of the node pool"
    type        = string
    default     = "webrace-default-pool"
}
variable "project_name" {
    description = "The name of the project where the cluster will be deployed"
    type        = string
    default     = "Webrace"
}
variable "docker_registry_name" {
    description = "The name of the Docker registry"
    type        = string
    default     = "webrace-docker-registry" 
}
variable "database_name" {
    description = "The name of the database"
    type        = string
    default     = "webrace-db"
}
variable "database_username" {
    description = "The username for the database"
    type        = string
    default     = "root"
}
