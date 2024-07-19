resource "rctf_challenge" "boogie-woogie" {
  name        = "boogie-woogie"
  author      = "pepsipu"
  description = "i've been watching too much jjk\n ${network.nc}"
  provide     = media
}

resource "s3_files" "media" {
  files = ["src/boogie-woogie.c", {
    name    = "boogie-woogie"
    content = containers_file(containers.build, "/app/boogie-woogie")
  }]
}

resource "docker_container" "main" {
  build    = "src"
  ports    = [5000]
  replicas = 1
}

resource "docker_container" "build" {
  build = "src/build"
}

resource "network" "network" {
  target        = 5000
  tcp           = 31040
  healthContent = "proof of work"
  container     = containers.build
}


