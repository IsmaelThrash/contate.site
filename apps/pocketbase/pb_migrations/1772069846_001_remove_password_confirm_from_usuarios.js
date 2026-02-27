/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  collection.fields.removeByName("password_confirm");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("usuarios");
  collection.fields.add(new TextField({
    name: "password_confirm",
    required: true
  }));
  return app.save(collection);
})
