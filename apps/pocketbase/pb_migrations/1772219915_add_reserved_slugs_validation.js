/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("slug");

  field.pattern = "^[a-z0-9-]+$";
  field.min = 3;

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("slug");
  field.min = 0;
  return app.save(collection);
})
