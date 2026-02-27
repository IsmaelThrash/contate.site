/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let collection = new Collection({
        type: "auth",
        name: "usuarios",
        listRule: "id = @request.auth.id",
        viewRule: "id = @request.auth.id",
        createRule: "",
        updateRule: "id = @request.auth.id",
        deleteRule: "id = @request.auth.id",
        fields: [
        {
                "hidden": false,
                "id": "text3579834370",
                "name": "slug",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
        },
        {
                "hidden": false,
                "id": "text5222209899",
                "name": "cor_fundo",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
        },
        {
                "hidden": false,
                "id": "number3734942490",
                "name": "status",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "number",
                "max": null,
                "min": null,
                "onlyInt": false
        }
],
    })

    try {
        app.save(collection)
    } catch (e) {
        if (e.message.includes("Collection name must be unique")) {
            console.log("Collection already exists, skipping")
            return
        }
        throw e
    }
}, (app) => {
    let collection = app.findCollectionByNameOrId("usuarios")
    app.delete(collection)
})
