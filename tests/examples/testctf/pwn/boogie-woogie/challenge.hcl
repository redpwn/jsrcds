challenge {
  name = "boogie-woogie"
  author = "pepsipu"
  description = "i've been watching too much jjk\n ${network.nc}"
}

upload {
    files = ["src/boogie-woogie.c", {
        name = "boogie-woogie"
        content = file(containers.build, "/app/boogie-woogie")
    }]
}

containers {
    main {
        build = "src"
        ports = [5000]
        replicas = 1
    }
    build {
        build = "src/build"
    }
}

network {
    target = 5000
    tcp = 31040
    healthContent = "proof of work"
    container = containers.build
}


