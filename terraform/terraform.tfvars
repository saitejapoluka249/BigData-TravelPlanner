# ---------------------------------------------------------------------------
# In CI/CD, pass sensitive values via environment variables:
#   TF_VAR_secret_key, TF_VAR_amadeus_client_id, etc.
# ---------------------------------------------------------------------------

project_id  = "wanderplanus"
region      = "us-central1"
environment = "prod"

# Set by Cloud Build — use placeholder here, CI/CD overrides at deploy time
backend_image  = "us-central1-docker.pkg.dev/wanderplanus/travel-app/backend:latest"
frontend_image = "us-central1-docker.pkg.dev/wanderplanus/travel-app/frontend:latest"

# Infra tuning
backend_min_instances  = 0
frontend_min_instances = 0
db_tier                = "db-f1-micro

# use environment variables in CI/CD
# secret_key            = "..."
# amadeus_client_id     = "..."
# amadeus_client_secret = "..."
# weather_api_key       = "..."
# bdc_api_key           = "..."
# db_password           = "..."
