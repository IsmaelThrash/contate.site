/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("slug");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("slug");
  field.required = true;
  return app.save(collection);
})
