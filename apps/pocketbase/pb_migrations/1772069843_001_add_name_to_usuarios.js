/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  
  collection.fields.add(new TextField({
    name: "name",
    required: false,
    max: 255
  }));
  
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  collection.fields.removeByName("name");
  return app.save(collection);
})
