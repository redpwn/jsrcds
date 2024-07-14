import HCL from "js-hcl-parser"

const hclString = `
challenge {
  name = "boogie-woogie"
  author = "pepsipu"
  description = "EOT i've been watching too much jjk EOT"
}

upload {
    files = ["src/boogie-woogie.c", {
        name = "boogie-woogie"
        content = "containers.build.file(/app/boogie-woogie)"
    }]
}

network {
    target = 5000
    tcp = 31040
    healthContent = "proof of work"
    container = "containers.main"
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

`

console.log(HCL.parse(hclString))
