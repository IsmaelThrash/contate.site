/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("status");
  field.min = 0;
  field.max = 1;
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("status");
  field.min = None;
  field.max = None;
  field.required = true;
  return app.save(collection);
})
