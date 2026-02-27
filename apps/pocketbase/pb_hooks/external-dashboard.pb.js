
/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/{$}", (e) => {
    const fileContent = $os.readFile(`${__hooks}/../.pocketbase-version`)
    const contentStr = Array.isArray(fileContent) 
        ? String.fromCharCode.apply(null, fileContent) 
        : fileContent
    const pbVersion = `v${contentStr.replace(/\n/g, '').trim()}`
    const externalUrl = `https://horizons-static-cdn.hostinger.com/pocketbase/__PB_VERSION__/ui/dist/index.html`.replace("__PB_VERSION__", pbVersion)

    try {
        const response = $http.send({
            url: externalUrl,
            method: "GET",
            timeout: 30,
        })

        const htmlContent = Array.isArray(response.body)
            ? String.fromCharCode.apply(null, response.body)
            : response.body

        return e.html(response.statusCode, htmlContent)
    } catch (err) {
        throw new NotFoundError("Failed to load dashboard", err)
    }
})
