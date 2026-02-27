/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("cor_fundo");
  field.required = false;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("usuarios");
  const field = collection.fields.getByName("cor_fundo");
  field.required = false;
  return app.save(collection);
})
